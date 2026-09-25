import os
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import (create_engine, Column, Integer, String, Float, Boolean,
                        Text, DateTime, ForeignKey, JSON)
from sqlalchemy.orm import sessionmaker, declarative_base, Session, relationship
from sqlalchemy.sql import func

load_dotenv()

# ============ DATABASE ============
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./paryatan.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============ MODELS ============
class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="tourist")
    preferred_language = Column(String, default="English")
    consent_given = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Destination(Base):
    __tablename__ = "destinations"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    categories = Column(JSON, default=list)
    latitude = Column(Float)
    longitude = Column(Float)
    best_season = Column(String, default="Oct-Mar")
    crowd_level = Column(String, default="normal")
    crowd_score = Column(Float, default=0.0)
    is_emerging = Column(Boolean, default=False)
    image_url = Column(String, nullable=True)
    verified = Column(Boolean, default=True)
    data_source = Column(String, default="demo_seed_data")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=120)
    price_range = Column(String, default="500-1500 INR (demo)")
    accessibility_info = Column(String, default="Standard access")
    verified = Column(Boolean, default=True)
    data_source = Column(String, default="demo_seed_data")

class Guide(Base):
    __tablename__ = "guides"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    bio = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    languages = Column(JSON, default=list)
    specialties = Column(JSON, default=list)
    price_per_day = Column(Integer, default=1500)
    availability = Column(String, default="Available")
    verification_status = Column(String, default="verified")
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=0)
    image_url = Column(String, nullable=True)

class Business(Base):
    __tablename__ = "businesses"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    business_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    price_range = Column(String, default="₹₹")
    verification_status = Column(String, default="verified")
    rating = Column(Float, default=4.3)
    review_count = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=True)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    tourist_id = Column(Integer, ForeignKey("profiles.id"))
    tourist_name = Column(String)
    provider_id = Column(Integer, nullable=True)
    provider_type = Column(String, default="guide")
    provider_name = Column(String)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=True)
    booking_date = Column(String, nullable=False)
    guest_count = Column(Integer, default=1)
    message = Column(Text, nullable=True)
    status = Column(String, default="pending")
    payment_status = Column(String, default="not_started")
    provider_response = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("profiles.id"), nullable=True)
    author_name = Column(String)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=True)
    provider_id = Column(Integer, nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("profiles.id"))
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DemandMetric(Base):
    __tablename__ = "demand_metrics"
    id = Column(Integer, primary_key=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    visitor_count = Column(Integer, default=0)
    booking_count = Column(Integer, default=0)
    search_count = Column(Integer, default=0)
    recent_review_count = Column(Integer, default=0)
    crowd_score = Column(Float, default=0.0)
    alternative_click_count = Column(Integer, default=0)

Base.metadata.create_all(bind=engine)

# ============ AUTH ============
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
TOKEN_EXPIRE = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def hash_pw(p): return pwd_context.hash(p)
def verify_pw(p, h):
    try: return pwd_context.verify(p, h)
    except: return False

def make_token(uid):
    exp = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE)
    return jwt.encode({"sub": str(uid), "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)

def current_user(token: Optional[str] = Depends(oauth2_scheme),
                 db: Session = Depends(get_db)) -> Optional[Profile]:
    if not token: return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload.get("sub")
        if not uid: return None
    except JWTError:
        return None
    return db.query(Profile).get(int(uid))

def require_user(u: Optional[Profile] = Depends(current_user)) -> Profile:
    if not u: raise HTTPException(401, "Authentication required")
    return u

# ============ SCHEMAS ============
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    role: str = "tourist"
    preferred_language: str = "English"
    consent_given: bool = False

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    preferred_language: str
    class Config: from_attributes = True

class BookingIn(BaseModel):
    provider_id: Optional[int] = None
    provider_type: str = "guide"
    provider_name: Optional[str] = None
    destination_id: Optional[int] = None
    booking_date: str
    guest_count: int = 1
    message: Optional[str] = None

class BookingStatusIn(BaseModel):
    status: str
    provider_response: Optional[str] = None

class ReviewIn(BaseModel):
    destination_id: Optional[int] = None
    provider_id: Optional[int] = None
    rating: int = Field(ge=1, le=5)
    comment: str

class RecoReq(BaseModel):
    budget: int = 8000
    duration_days: int = 3
    starting_city: str = "Bhubaneswar"
    preferred_region: Optional[str] = None
    interests: List[str] = []
    travel_type: str = "family"
    language: str = "English"
    crowd_preference: str = "avoid_crowds"
    accessibility_required: bool = False

# ============ APP ============
app = FastAPI(title="Paryatan Connect API", version="1.0.0",
              description="AI-Powered Smart Tourism Ecosystem — TechnoTrek / SIH 2026")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    from seed import seed_all
    seed_all(SessionLocal)

    def normalize(vals):
        if not vals:
            return []
        lo, hi = min(vals), max(vals)
        if hi == lo:
            return [0.0] * len(vals)
        return [(v - lo) / (hi - lo) for v in vals]

    db = SessionLocal()
    try:
        metrics = db.query(DemandMetric).all()
        if metrics:
            nv = normalize([m.visitor_count for m in metrics])
            nb = normalize([m.booking_count for m in metrics])
            ns = normalize([m.search_count for m in metrics])
            nr = normalize([m.recent_review_count for m in metrics])
            for i, m in enumerate(metrics):
                score = 0.40 * nv[i] + 0.25 * nb[i] + 0.20 * ns[i] + 0.15 * nr[i]
                s100 = round(score * 100, 2)
                if s100 < 40:
                    lvl = "normal"
                elif s100 < 70:
                    lvl = "busy"
                else:
                    lvl = "crowded"
                d = db.query(Destination).get(m.destination_id)
                if d:
                    d.crowd_score = s100
                    d.crowd_level = lvl
            db.commit()
    finally:
        db.close()
@app.get("/")
def root():
    return {"app": "Paryatan Connect", "status": "running", "docs": "/docs"}

# ============ AUTH ROUTES ============
@app.post("/api/auth/register")
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(Profile).filter(Profile.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    p = Profile(email=data.email, hashed_password=hash_pw(data.password),
                full_name=data.full_name, role=data.role,
                preferred_language=data.preferred_language,
                consent_given=data.consent_given)
    db.add(p); db.commit(); db.refresh(p)
    return {"access_token": make_token(p.id), "token_type": "bearer",
            "user": UserOut.model_validate(p)}

@app.post("/api/auth/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.email == data.email).first()
    if not p or not verify_pw(data.password, p.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    return {"access_token": make_token(p.id), "token_type": "bearer",
            "user": UserOut.model_validate(p)}

@app.get("/api/auth/me", response_model=UserOut)
def me(u: Profile = Depends(require_user)):
    return u

@app.post("/api/auth/logout")
def logout():
    return {"message": "Logged out"}

# ============ DESTINATIONS ============
@app.get("/api/destinations")
def list_destinations(
    state: Optional[str] = None, category: Optional[str] = None,
    crowd_level: Optional[str] = None, is_emerging: Optional[bool] = None,
    q: Optional[str] = None, db: Session = Depends(get_db)
):
    query = db.query(Destination)
    if state: query = query.filter(Destination.state == state)
    if crowd_level: query = query.filter(Destination.crowd_level == crowd_level)
    if is_emerging is not None: query = query.filter(Destination.is_emerging == is_emerging)
    if q:
        query = query.filter(
            (Destination.name.ilike(f"%{q}%")) |
            (Destination.description.ilike(f"%{q}%")) |
            (Destination.state.ilike(f"%{q}%"))
        )
    results = query.all()
    if category:
        results = [d for d in results if category in (d.categories or [])]
    return results

@app.get("/api/destinations/{dest_id}")
def get_destination(dest_id: int, db: Session = Depends(get_db)):
    d = db.query(Destination).get(dest_id)
    if not d: raise HTTPException(404, "Not found")
    return d

@app.get("/api/destinations/slug/{slug}")
def get_by_slug(slug: str, db: Session = Depends(get_db)):
    d = db.query(Destination).filter(Destination.slug == slug).first()
    if not d: raise HTTPException(404, "Not found")
    return d

# ============ ACTIVITIES ============
@app.get("/api/activities")
def list_activities(destination_id: Optional[int] = None,
                    category: Optional[str] = None,
                    db: Session = Depends(get_db)):
    q = db.query(Activity)
    if destination_id: q = q.filter(Activity.destination_id == destination_id)
    if category: q = q.filter(Activity.category == category)
    return q.all()

@app.get("/api/activities/{aid}")
def get_activity(aid: int, db: Session = Depends(get_db)):
    a = db.query(Activity).get(aid)
    if not a: raise HTTPException(404, "Not found")
    return a

# ============ GUIDES ============
@app.get("/api/guides")
def list_guides(db: Session = Depends(get_db)):
    return db.query(Guide).all()

@app.get("/api/guides/{gid}")
def get_guide(gid: int, db: Session = Depends(get_db)):
    g = db.query(Guide).get(gid)
    if not g: raise HTTPException(404, "Not found")
    return g

# ============ BUSINESSES ============
@app.get("/api/businesses")
def list_businesses(business_type: Optional[str] = None,
                    db: Session = Depends(get_db)):
    q = db.query(Business)
    if business_type: q = q.filter(Business.business_type == business_type)
    return q.all()

@app.get("/api/businesses/{bid}")
def get_business(bid: int, db: Session = Depends(get_db)):
    b = db.query(Business).get(bid)
    if not b: raise HTTPException(404, "Not found")
    return b

# ============ BOOKINGS ============
@app.post("/api/bookings")
def create_booking(data: BookingIn, u: Profile = Depends(require_user),
                   db: Session = Depends(get_db)):
    b = Booking(tourist_id=u.id, tourist_name=u.full_name,
                provider_id=data.provider_id, provider_type=data.provider_type,
                provider_name=data.provider_name, destination_id=data.destination_id,
                booking_date=data.booking_date, guest_count=data.guest_count,
                message=data.message, status="pending", payment_status="not_started")
    db.add(b); db.commit(); db.refresh(b)
    return b

@app.get("/api/bookings/my")
def my_bookings(u: Profile = Depends(require_user), db: Session = Depends(get_db)):
    return db.query(Booking).filter(Booking.tourist_id == u.id)\
             .order_by(Booking.created_at.desc()).all()

@app.get("/api/bookings/provider")
def provider_bookings(u: Profile = Depends(require_user), db: Session = Depends(get_db)):
    return db.query(Booking).filter(Booking.provider_id == u.id)\
             .order_by(Booking.created_at.desc()).all()

@app.get("/api/bookings/all")
def all_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).order_by(Booking.created_at.desc()).all()

@app.get("/api/bookings/{bid}")
def get_booking(bid: int, db: Session = Depends(get_db)):
    b = db.query(Booking).get(bid)
    if not b: raise HTTPException(404, "Not found")
    return b

@app.patch("/api/bookings/{bid}/status")
def update_booking_status(bid: int, data: BookingStatusIn,
                          u: Profile = Depends(require_user),
                          db: Session = Depends(get_db)):
    b = db.query(Booking).get(bid)
    if not b: raise HTTPException(404, "Not found")
    b.status = data.status
    if data.provider_response: b.provider_response = data.provider_response
    db.commit(); db.refresh(b)
    return b

# ============ REVIEWS ============
@app.post("/api/reviews")
def create_review(data: ReviewIn, u: Profile = Depends(require_user),
                  db: Session = Depends(get_db)):
    r = Review(author_id=u.id, author_name=u.full_name,
               destination_id=data.destination_id, provider_id=data.provider_id,
               rating=data.rating, comment=data.comment)
    db.add(r); db.commit(); db.refresh(r)
    return r

@app.get("/api/reviews")
def list_reviews(destination_id: Optional[int] = None,
                 db: Session = Depends(get_db)):
    q = db.query(Review)
    if destination_id: q = q.filter(Review.destination_id == destination_id)
    return q.order_by(Review.created_at.desc()).all()

# ============ FAVORITES ============
@app.post("/api/favorites/{dest_id}")
def add_favorite(dest_id: int, u: Profile = Depends(require_user),
                 db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter(
        Favorite.user_id == u.id, Favorite.destination_id == dest_id).first()
    if existing: return existing
    f = Favorite(user_id=u.id, destination_id=dest_id)
    db.add(f); db.commit(); db.refresh(f)
    return f

@app.get("/api/favorites")
def list_favorites(u: Profile = Depends(require_user), db: Session = Depends(get_db)):
    favs = db.query(Favorite).filter(Favorite.user_id == u.id).all()
    ids = [f.destination_id for f in favs]
    return db.query(Destination).filter(Destination.id.in_(ids)).all() if ids else []

# ============ AI RECOMMENDATIONS ============
INTEREST_KW = {
    "heritage": ["heritage", "temple", "monument", "history", "fort", "ashok"],
    "nature": ["nature", "hill", "forest", "lake", "waterfall", "lagoon"],
    "beach": ["beach", "coast", "sea", "shore"],
    "food": ["food", "cuisine", "culinary", "market"],
    "culture": ["culture", "art", "dance", "craft", "village", "painting"],
    "wildlife": ["wildlife", "sanctuary", "tiger", "reserve", "dolphin"],
    "adventure": ["adventure", "trek", "safari", "camp"],
    "spiritual": ["spiritual", "temple", "pilgrim", "pagoda"],
    "shopping": ["shopping", "handicraft", "market", "silver"],
    "wellness": ["wellness", "yoga", "spa", "retreat"],
}

def interest_score(interests, text):
    if not interests: return 0
    text = text.lower(); s = 0
    for i in interests:
        kws = INTEREST_KW.get(i, [i])
        if any(k in text for k in kws): s += 10
    return s

def score_destination(d, req):
    reasons = []; score = 0
    txt = " ".join(d.categories or []) + " " + d.description
    im = min(30, interest_score(req.interests, txt) * 1.5)
    if im > 0:
        score += im
        reasons.append(f"Matches your {', '.join(req.interests)} interests.")
    if req.budget >= 5000:
        score += 15; reasons.append("Fits within your budget.")
    if req.language in ["English", "Hindi"]:
        score += 8; reasons.append(f"Language support in {req.language}.")
    if d.is_emerging:
        score += 12; reasons.append("Emerging destination (sustainable tourism).")
    if req.crowd_preference == "avoid_crowds":
        if d.crowd_level == "normal":
            score += 15; reasons.append("Lower crowd level.")
        elif d.crowd_level == "crowded":
            score -= 15; reasons.append("Currently crowded in demo dataset.")
    return round(score, 2), reasons

@app.post("/api/recommendations")
def recommend(req: RecoReq, db: Session = Depends(get_db)):
    dests = db.query(Destination).all()
    scored = []
    for d in dests:
        s, r = score_destination(d, req)
        scored.append({"destination": d, "score": s, "reason": " ".join(r)})
    scored.sort(key=lambda x: x["score"], reverse=True)
    top = scored[:5]

    top_ids = [x["destination"].id for x in top]
    acts = db.query(Activity).filter(Activity.destination_id.in_(top_ids)).all()
    act_list = [{"activity": a, "reason": f"Popular in {a.category} category."} for a in acts[:8]]

    days = max(1, req.duration_days)
    plan = []
    for i in range(days):
        if not top: break
        dest = top[i % len(top)]["destination"]
        day_acts = [a.name for a in acts if a.destination_id == dest.id][:3]
        plan.append({
            "day": i + 1,
            "title": f"Explore {dest.name}",
            "destination": dest.name,
            "activities": day_acts or ["Heritage walk", "Local market visit"],
            "notes": f"Best season: {dest.best_season}. Crowd: {dest.crowd_level}."
        })

    guides = db.query(Guide).limit(3).all()
    est_budget = min(req.budget, req.duration_days * 2500)

    alt_reason = ""
    crowded = [x for x in scored if x["destination"].crowd_level == "crowded"][:1]
    if crowded and req.crowd_preference == "avoid_crowds":
        c = crowded[0]["destination"]
        alts = [x["destination"].name for x in scored
                if x["destination"].id != c.id and x["destination"].crowd_level == "normal"][:2]
        if alts:
            alt_reason = f"{c.name} is currently crowded in our demo dataset. You may also explore {', '.join(alts)} with lower crowd levels."

    return {
        "summary": f"A {req.duration_days}-day {', '.join(req.interests[:2]) or 'custom'} journey from {req.starting_city}",
        "estimated_budget": est_budget,
        "destinations": top,
        "activities": act_list,
        "daily_itinerary": plan,
        "recommended_guides": guides,
        "alternative_destination_reason": alt_reason,
        "disclaimer": "Demo data only. Prices and availability must be verified before booking."
    }

# ============ DEMAND DISTRIBUTION ============
def normalize(vals):
    if not vals: return []
    lo, hi = min(vals), max(vals)
    return [0.0]*len(vals) if hi == lo else [(v-lo)/(hi-lo) for v in vals]

@app.get("/api/demand/crowd-levels")
def crowd_levels(db: Session = Depends(get_db)):
    metrics = db.query(DemandMetric).all()
    if not metrics:
        return []
    nv = normalize([m.visitor_count for m in metrics])
    nb = normalize([m.booking_count for m in metrics])
    ns = normalize([m.search_count for m in metrics])
    nr = normalize([m.recent_review_count for m in metrics])
    out = []
    for i, m in enumerate(metrics):
        score = 0.40*nv[i] + 0.25*nb[i] + 0.20*ns[i] + 0.15*nr[i]
        s100 = round(score*100, 2)
        lvl = "normal" if s100 < 40 else "busy" if s100 < 70 else "crowded"
        d = db.query(Destination).get(m.destination_id)
        if d:
            d.crowd_score = s100; d.crowd_level = lvl
            out.append({"destination_id": d.id, "destination_name": d.name,
                        "state": d.state, "crowd_score": s100,
                        "crowd_level": lvl, "is_emerging": d.is_emerging})
    db.commit()
    return out

@app.get("/api/demand/alternatives/{dest_id}")
def alternatives(dest_id: int, db: Session = Depends(get_db)):
    target = db.query(Destination).get(dest_id)
    if not target: raise HTTPException(404, "Not found")
    others = db.query(Destination).filter(Destination.id != dest_id).all()
    scored = []
    for o in others:
        sim = 0
        tc, oc = set(target.categories or []), set(o.categories or [])
        if tc and oc: sim += 40 * len(tc & oc) / len(tc | oc)
        if target.state == o.state: sim += 30
        bonus = 20 if o.is_emerging else 0
        crowd_bonus = {"normal": 30, "busy": 15, "crowded": 0}.get(o.crowd_level, 0)
        scored.append({
            "destination": o,
            "similarity_score": round(sim, 2),
            "final_score": sim + bonus + crowd_bonus,
            "reason": f"Shares categories with {target.name}, is {o.crowd_level} (lower crowd), {'and is emerging.' if o.is_emerging else ''}"
        })
    scored.sort(key=lambda x: x["final_score"], reverse=True)
    return scored[:3]

@app.get("/api/admin/demand-analytics")
def demand_analytics(db: Session = Depends(get_db)):
    dests = db.query(Destination).all()
    return {
        "crowded": [{"name": d.name, "score": d.crowd_score} for d in dests if d.crowd_level == "crowded"],
        "busy": [{"name": d.name, "score": d.crowd_score} for d in dests if d.crowd_level == "busy"],
        "normal": [{"name": d.name, "score": d.crowd_score} for d in dests if d.crowd_level == "normal"],
        "emerging": [{"name": d.name, "state": d.state} for d in dests if d.is_emerging],
        "total_destinations": len(dests),
        "total_crowded": sum(1 for d in dests if d.crowd_level == "crowded"),
        "total_emerging": sum(1 for d in dests if d.is_emerging),
    }

# ============ ADMIN ============
@app.get("/api/admin/stats")
def admin_stats(db: Session = Depends(get_db)):
    return {
        "total_tourists": db.query(Profile).filter(Profile.role == "tourist").count(),
        "total_providers": db.query(Profile).filter(Profile.role.in_(["guide", "business"])).count(),
        "total_guides": db.query(Guide).count(),
        "total_destinations": db.query(Destination).count(),
        "total_bookings": db.query(Booking).count(),
        "pending_bookings": db.query(Booking).filter(Booking.status == "pending").count(),
        "total_reviews": db.query(Review).count(),
        "avg_rating": round((db.query(func.avg(Review.rating)).scalar() or 0), 2),
        "total_activities": db.query(Activity).count(),
        "total_businesses": db.query(Business).count(),
    }