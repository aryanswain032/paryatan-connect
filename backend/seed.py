from sqlalchemy.orm import Session
from main import Profile, Destination, Activity, Guide, Business, Review, DemandMetric, hash_pw


def seed_all(SessionLocal):
    db: Session = SessionLocal()
    try:
        if db.query(Destination).count() > 0:
            return  # already seeded

        # ---- Demo users ----
        users = [
            Profile(email="tourist@demo.com", hashed_password=hash_pw("demo1234"),
                    full_name="Demo Tourist", role="tourist", consent_given=True),
            Profile(email="guide@demo.com", hashed_password=hash_pw("demo1234"),
                    full_name="Demo Guide", role="guide", consent_given=True),
            Profile(email="business@demo.com", hashed_password=hash_pw("demo1234"),
                    full_name="Demo Business", role="business", consent_given=True),
            Profile(email="admin@demo.com", hashed_password=hash_pw("demo1234"),
                    full_name="Demo Admin", role="admin", consent_given=True),
        ]
        for u in users: db.add(u)
        db.commit()

        # ---- Destinations ----
        dests = [
            ("Bhubaneswar","bhubaneswar","Odisha","Khordha",
             "Temple city with ancient Kalinga architecture and vibrant markets.",
             ["heritage","culture","food"], 20.2961, 85.8245, "Oct-Mar", False,
             "https://picsum.photos/seed/bhubaneswar/800/500"),
            ("Puri","puri","Odisha","Puri",
             "Coastal spiritual town, Jagannath Temple and golden beaches.",
             ["spiritual","beach","culture"], 19.8135, 85.8312, "Oct-Feb", False,
             "https://picsum.photos/seed/puri/800/500"),
            ("Konark","konark","Odisha","Puri",
             "UNESCO Sun Temple with iconic stone chariot architecture.",
             ["heritage","culture"], 19.8876, 86.0945, "Oct-Mar", False,
             "https://picsum.photos/seed/konark/800/500"),
            ("Dhauli","dhauli","Odisha","Khordha",
             "Peace pagoda and Ashokan edicts with hilltop views.",
             ["heritage","spiritual"], 20.1917, 85.8400, "Oct-Mar", True,
             "https://picsum.photos/seed/dhauli/800/500"),
            ("Chilika Lake","chilika","Odisha","Ganjam",
             "Asia's largest brackish lagoon with dolphins and migratory birds.",
             ["nature","wildlife"], 19.7175, 85.3206, "Nov-Feb", False,
             "https://picsum.photos/seed/chilika/800/500"),
            ("Cuttack","cuttack","Odisha","Cuttack",
             "Silver city with riverside forts and famous filigree crafts.",
             ["heritage","shopping","food"], 20.4625, 85.8830, "Oct-Mar", True,
             "https://picsum.photos/seed/cuttack/800/500"),
            ("Similipal","similipal","Odisha","Mayurbhanj",
             "Tiger reserve and biosphere with waterfalls and tribal culture.",
             ["wildlife","nature","adventure"], 21.9500, 86.3167, "Nov-Mar", True,
             "https://picsum.photos/seed/similipal/800/500"),
            ("Satkosia","satkosia","Odisha","Angul",
             "Gorge sanctuary on Mahanadi, ideal for river safaris.",
             ["nature","wildlife","adventure"], 20.6500, 84.9333, "Oct-Feb", True,
             "https://picsum.photos/seed/satkosia/800/500"),
            ("Gopalpur","gopalpur","Odisha","Ganjam",
             "Quiet beach town with colonial charm and lighthouse.",
             ["beach","wellness"], 19.2667, 84.9167, "Oct-Mar", True,
             "https://picsum.photos/seed/gopalpur/800/500"),
            ("Raghurajpur","raghurajpur","Odisha","Puri",
             "Heritage crafts village for Pattachitra paintings and dance.",
             ["culture","heritage","shopping"], 19.8547, 85.8622, "Oct-Mar", True,
             "https://picsum.photos/seed/raghurajpur/800/500"),
        ]
        for d in dests:
            db.add(Destination(name=d[0], slug=d[1], state=d[2], district=d[3],
                               description=d[4], categories=d[5],
                               latitude=d[6], longitude=d[7], best_season=d[8],
                               is_emerging=d[9], image_url=d[10]))
        db.commit()

        # ---- Activities ----
        acts = [
            (1,"Lingaraj Temple Heritage Walk","Guided walk through 11th-century temple complex.","heritage",120,"300-800 INR (demo)"),
            (1,"Odissi Dance Performance","Evening classical Odissi dance show.","culture",90,"500-1200 INR (demo)"),
            (1,"Ekamra Haat Craft Market","Shop handloom and handicrafts.","shopping",180,"Free entry (demo)"),
            (2,"Jagannath Temple Darshan","Guided spiritual visit with priest.","spiritual",120,"Free (demo)"),
            (2,"Puri Beach Sunset Walk","Guided sunset walk along golden beach.","beach",90,"200-500 INR (demo)"),
            (3,"Sun Temple Architecture Tour","Deep-dive into Konark's stone chariot.","heritage",150,"400-900 INR (demo)"),
            (4,"Dhauli Peace Pagoda Visit","Hilltop stupa and Ashokan edicts tour.","heritage",90,"Free (demo)"),
            (5,"Chilika Dolphin Boat Safari","Morning boat ride to spot dolphins.","wildlife",180,"1500-2500 INR (demo)"),
            (5,"Bird Watching at Mangalajodi","Guided birdwatching in wetlands.","nature",240,"800-1500 INR (demo)"),
            (6,"Cuttack Silver Filigree Workshop","Hands-on filigree craft session.","culture",120,"600-1200 INR (demo)"),
            (6,"Barabati Fort Heritage Walk","Walk through 14th-century fort ruins.","heritage",120,"300-600 INR (demo)"),
            (7,"Similipal Jungle Safari","Jeep safari in tiger reserve.","adventure",300,"2000-3500 INR (demo)"),
            (8,"Satkosia River Cruise","Boat cruise through Mahanadi gorge.","adventure",150,"1000-1800 INR (demo)"),
            (9,"Gopalpur Lighthouse Tour","Climb historic lighthouse for views.","beach",60,"100-300 INR (demo)"),
            (10,"Pattachitra Painting Class","Learn traditional painting from artisans.","culture",180,"700-1500 INR (demo)"),
        ]
        for a in acts:
            db.add(Activity(destination_id=a[0], name=a[1], description=a[2],
                            category=a[3], duration_minutes=a[4], price_range=a[5]))
        db.commit()

        # ---- Guides ----
        guides = [
            ("Rajesh Mohanty","20 years guiding heritage tours across Odisha.",
             "Bhubaneswar",["English","Hindi","Odia"],["heritage","culture"],1800,4.8,34),
            ("Priya Das","Specialist in Odissi dance and craft villages.",
             "Puri",["English","Odia"],["culture","shopping"],1500,4.7,28),
            ("Sanjay Behera","Wildlife and nature guide at Chilika and Similipal.",
             "Chilika",["English","Hindi","Odia"],["wildlife","nature"],2200,4.9,42),
            ("Anita Sahoo","Food walks and street food experiences.",
             "Cuttack",["English","Hindi"],["food","culture"],1200,4.6,19),
            ("Debasis Nayak","Adventure guide for trekking and river safaris.",
             "Satkosia",["English","Odia"],["adventure","nature"],2000,4.7,25),
        ]
        for g in guides:
            db.add(Guide(name=g[0], bio=g[1], location=g[2], languages=g[3],
                         specialties=g[4], price_per_day=g[5], rating=g[6],
                         review_count=g[7], verification_status="verified",
                         image_url=f"https://i.pravatar.cc/200?u={g[0]}"))
        db.commit()

        # ---- Businesses ----
        biz = [
            ("Hotel Kalinga Grand","hotel","Comfortable business hotel in central Bhubaneswar.","Bhubaneswar","₹₹₹",1),
            ("Chilika Lake Resort","hotel","Eco-resort facing Chilika lagoon.","Chilika","₹₹₹₹",5),
            ("Dalma Restaurant","restaurant","Authentic Odia thali and vegetarian cuisine.","Bhubaneswar","₹₹",1),
            ("Puri Beach Shack","restaurant","Seafood and Oriya street food by the sea.","Puri","₹₹",2),
            ("Utkal Handicrafts Emporium","shop","Handloom, silver filigree and Pattachitra.","Cuttack","₹₹",6),
            ("Konark Adventure Tours","activity","Guided heritage and cycling tours.","Konark","₹₹",3),
            ("Similipal Nature Camps","activity","Jungle camping and safari packages.","Similipal","₹₹₹",7),
            ("Gopalpur Surf School","activity","Beginner and intermediate surf lessons.","Gopalpur","₹₹",9),
        ]
        for b in biz:
            db.add(Business(name=b[0], business_type=b[1], description=b[2],
                            address=b[3], price_range=b[4], destination_id=b[5],
                            phone="+91-9999999999", verification_status="verified",
                            image_url=f"https://picsum.photos/seed/{b[0]}/400/300"))
        db.commit()

        # ---- Reviews ----
        reviews = [
            (1,"Amazing temples and food!",5,1),
            (1,"Great heritage walk with Rajesh.",5,1),
            (2,"Beach was beautiful at sunset.",4,2),
            (3,"Sun Temple is breathtaking.",5,3),
            (5,"Saw dolphins! Magical experience.",5,5),
            (6,"Silver filigree workshop was fun.",4,6),
            (7,"Safari was thrilling.",5,7),
            (9,"Quiet and peaceful beach.",4,9),
            (10,"Loved the Pattachitra class.",5,10),
            (4,"Dhauli pagoda has great views.",4,4),
        ]
        for r in reviews:
            db.add(Review(author_name="Demo Tourist", destination_id=r[3],
                          rating=r[2], comment=r[1]))
        db.commit()

        # ---- Demand metrics (varied to trigger crowd levels) ----
        metrics = [
            (1, 1200, 180, 850, 45),   # Bhubaneswar - busy
            (2, 2500, 320, 1400, 60),  # Puri - crowded
            (3, 1800, 250, 1100, 55),  # Konark - crowded
            (4, 150, 20, 90, 8),       # Dhauli - normal
            (5, 600, 85, 420, 25),     # Chilika - busy
            (6, 320, 45, 210, 12),     # Cuttack - normal
            (7, 180, 25, 130, 10),     # Similipal - normal
            (8, 140, 18, 100, 7),      # Satkosia - normal
            (9, 220, 30, 160, 11),     # Gopalpur - normal
            (10, 90, 12, 70, 5),       # Raghurajpur - normal
        ]
        for m in metrics:
            db.add(DemandMetric(destination_id=m[0], visitor_count=m[1],
                                booking_count=m[2], search_count=m[3],
                                recent_review_count=m[4]))
        db.commit()
        print("✅ Seed data loaded. Demo users: tourist@demo.com / demo1234")
    finally:
        db.close()