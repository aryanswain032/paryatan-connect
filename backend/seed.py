from sqlalchemy.orm import Session
from sqlalchemy import text
from main import Profile, Destination, Activity, Guide, Business, Review, DemandMetric, hash_pw, engine


def seed_all(SessionLocal):
    db = SessionLocal()

    if db.query(Destination).count() >= 30 and db.query(Activity).count() >= 20:
        db.close()
        return

    if "postgresql" in str(engine.url):
        db.execute(text("TRUNCATE TABLE demand_metrics, reviews, activities, businesses, guides, destinations, profiles RESTART IDENTITY CASCADE"))
    else:
        db.query(DemandMetric).delete()
        db.query(Review).delete()
        db.query(Activity).delete()
        db.query(Business).delete()
        db.query(Guide).delete()
        db.query(Destination).delete()
        db.query(Profile).delete()
    db.commit()

    db.add(Profile(email="tourist@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Tourist", role="tourist", consent_given=True))
    db.add(Profile(email="guide@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Guide", role="guide", consent_given=True))
    db.add(Profile(email="business@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Business", role="business", consent_given=True))
    db.add(Profile(email="admin@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Admin", role="admin", consent_given=True))
    db.commit()

    dests = [
        ("Bhubaneswar", "bhubaneswar", "Odisha", "Khordha", "Temple city.", "heritage,culture,food", 20.2961, 85.8245, "Oct-Mar", False),
        ("Puri", "puri", "Odisha", "Puri", "Coastal town.", "spiritual,beach,culture", 19.8135, 85.8312, "Oct-Feb", False),
        ("Konark", "konark", "Odisha", "Puri", "Sun Temple.", "heritage,culture", 19.8876, 86.0945, "Oct-Mar", False),
        ("Dhauli", "dhauli", "Odisha", "Khordha", "Peace pagoda.", "heritage,spiritual", 20.1917, 85.8400, "Oct-Mar", True),
        ("Chilika", "chilika", "Odisha", "Ganjam", "Lagoon.", "nature,wildlife", 19.7175, 85.3206, "Nov-Feb", False),
        ("Cuttack", "cuttack", "Odisha", "Cuttack", "Silver city.", "heritage,shopping,food", 20.4625, 85.8830, "Oct-Mar", True),
        ("Similipal", "similipal", "Odisha", "Mayurbhanj", "Tiger reserve.", "wildlife,nature", 21.9500, 86.3167, "Nov-Mar", True),
        ("Satkosia", "satkosia", "Odisha", "Angul", "Gorge.", "nature,wildlife", 20.6500, 84.9333, "Oct-Feb", True),
        ("Gopalpur", "gopalpur", "Odisha", "Ganjam", "Beach town.", "beach,wellness", 19.2667, 84.9167, "Oct-Mar", True),
        ("Raghurajpur", "raghurajpur", "Odisha", "Puri", "Crafts village.", "culture,heritage", 19.8547, 85.8622, "Oct-Mar", True),
        ("Jaipur", "jaipur", "Rajasthan", "Jaipur", "Pink City.", "heritage,culture,shopping", 26.9124, 75.7873, "Oct-Mar", False),
        ("Udaipur", "udaipur", "Rajasthan", "Udaipur", "City of Lakes.", "heritage,wellness", 24.5854, 73.7125, "Oct-Mar", True),
        ("Jaisalmer", "jaisalmer", "Rajasthan", "Jaisalmer", "Desert city.", "heritage,adventure", 26.9157, 70.9083, "Nov-Feb", True),
        ("Ranthambore", "ranthambore", "Rajasthan", "Sawai Madhopur", "Tiger reserve.", "wildlife,nature", 26.0173, 76.5026, "Oct-Apr", False),
        ("Munnar", "munnar", "Kerala", "Idukki", "Tea plantations.", "nature,wellness", 10.0889, 77.0595, "Sep-May", False),
        ("Alleppey", "alleppey", "Kerala", "Alappuzha", "Backwaters.", "nature,wellness", 9.4981, 76.3388, "Sep-Mar", False),
        ("Kovalam", "kovalam", "Kerala", "Thiruvananthapuram", "Ayurveda.", "beach,wellness", 8.4004, 76.9787, "Oct-Mar", True),
        ("Wayanad", "wayanad", "Kerala", "Wayanad", "Western Ghats.", "nature,wildlife", 11.6854, 76.1320, "Oct-May", True),
        ("Hampi", "hampi", "Karnataka", "Vijayanagara", "Ruins.", "heritage,culture", 15.3350, 76.4600, "Oct-Feb", False),
        ("Coorg", "coorg", "Karnataka", "Kodagu", "Coffee hills.", "nature,wellness", 12.3375, 75.8069, "Oct-Mar", True),
        ("Mysore", "mysore", "Karnataka", "Mysuru", "Royal palace.", "heritage,culture", 12.2958, 76.6394, "Oct-Feb", True),
        ("Madurai", "madurai", "Tamil Nadu", "Madurai", "Temple city.", "heritage,spiritual", 9.9252, 78.1198, "Oct-Mar", False),
        ("Mahabalipuram", "mahabalipuram", "Tamil Nadu", "Chengalpattu", "Shore temples.", "heritage,culture", 12.6208, 80.1945, "Nov-Feb", True),
        ("Ooty", "ooty", "Tamil Nadu", "Nilgiris", "Hill station.", "nature,wellness", 11.4102, 76.6950, "Mar-Jun", True),
        ("Varanasi", "varanasi", "Uttar Pradesh", "Varanasi", "Ganga ghats.", "spiritual,heritage", 25.3176, 82.9739, "Oct-Mar", False),
        ("Agra", "agra", "Uttar Pradesh", "Agra", "Taj Mahal.", "heritage,culture", 27.1767, 78.0081, "Oct-Mar", False),
        ("Rishikesh", "rishikesh", "Uttarakhand", "Dehradun", "Yoga capital.", "wellness,adventure", 30.0869, 78.2676, "Sep-Apr", True),
        ("North Goa", "north-goa", "Goa", "North Goa", "Beaches.", "beach,adventure", 15.5527, 73.7517, "Nov-Feb", False),
        ("Manali", "manali", "Himachal Pradesh", "Kullu", "Snow peaks.", "adventure,nature", 32.2432, 77.1892, "Mar-Jun", True),
        ("Darjeeling", "darjeeling", "West Bengal", "Darjeeling", "Tea gardens.", "nature,wellness", 27.0360, 88.2627, "Mar-May", True),
        ("Kaziranga", "kaziranga", "Assam", "Golaghat", "Rhinos.", "wildlife,nature", 26.5775, 93.1711, "Nov-Apr", False),
        ("Ajanta Ellora", "ajanta-ellora", "Maharashtra", "Aurangabad", "Cave art.", "heritage,culture", 20.5519, 75.7033, "Oct-Mar", True),
        ("Rann of Kutch", "rann-of-kutch", "Gujarat", "Kutch", "Salt desert.", "nature,culture", 23.7337, 69.8597, "Nov-Feb", True),
        ("Khajuraho", "khajuraho", "Madhya Pradesh", "Chhatarpur", "Temples.", "heritage,culture", 24.8318, 79.9199, "Oct-Mar", False),
        ("Amritsar", "amritsar", "Punjab", "Amritsar", "Golden Temple.", "spiritual,food", 31.6340, 74.8723, "Oct-Mar", True),
        ("Hyderabad", "hyderabad", "Telangana", "Hyderabad", "Biryani city.", "heritage,food", 17.3850, 78.4867, "Oct-Feb", True),
    ]
    for d in dests:
        db.add(Destination(name=d[0], slug=d[1], state=d[2], district=d[3], description=d[4], categories=d[5].split(","), latitude=d[6], longitude=d[7], best_season=d[8], is_emerging=d[9], image_url="https://picsum.photos/seed/" + d[1] + "/800/500"))
    db.commit()

    acts = [
        (1, "Lingaraj Temple Walk", "Temple tour.", "heritage", 120, "300-800 INR"),
        (2, "Jagannath Darshan", "Spiritual visit.", "spiritual", 120, "Free"),
        (3, "Konark Temple Tour", "Chariot tour.", "heritage", 150, "400-900 INR"),
        (5, "Chilika Dolphin Safari", "Dolphins.", "wildlife", 180, "1500-2500 INR"),
        (7, "Similipal Safari", "Tiger safari.", "adventure", 300, "2000-3500 INR"),
        (11, "Amber Fort Tour", "Jaipur fort.", "heritage", 240, "500-1500 INR"),
        (14, "Tiger Safari", "Ranthambore.", "wildlife", 240, "2000-4000 INR"),
        (15, "Munnar Tea Walk", "Tea tour.", "nature", 120, "300-800 INR"),
        (16, "Alleppey Houseboat", "Backwaters.", "nature", 720, "5000-12000 INR"),
        (19, "Hampi Cycling Tour", "Ruins.", "heritage", 240, "500-1200 INR"),
        (25, "Varanasi Ganga Aarti", "Aarti.", "spiritual", 120, "Free"),
        (26, "Taj Mahal Sunrise", "Sunrise Taj.", "heritage", 180, "500-1500 INR"),
        (27, "Rishikesh Rafting", "Rafting.", "adventure", 180, "1000-2500 INR"),
        (31, "Kaziranga Safari", "Rhino safari.", "wildlife", 120, "1500-3000 INR"),
        (35, "Golden Temple Visit", "Darshan.", "spiritual", 120, "Free"),
        (36, "Hyderabad Biryani Trail", "Biryani walk.", "food", 120, "800-1500 INR"),
    ]
    for a in acts:
        db.add(Activity(destination_id=a[0], name=a[1], description=a[2], category=a[3], duration_minutes=a[4], price_range=a[5]))
    db.commit()

    guides = [
        ("Rajesh Mohanty", "Heritage guide.", "Bhubaneswar", ["English", "Hindi", "Odia"], ["heritage", "culture"], 1800, 4.8, 34),
        ("Priya Das", "Odissi expert.", "Puri", ["English", "Odia"], ["culture"], 1500, 4.7, 28),
        ("Sanjay Behera", "Wildlife guide.", "Chilika", ["English", "Hindi"], ["wildlife"], 2200, 4.9, 42),
        ("Anita Sahoo", "Food walk guide.", "Cuttack", ["English", "Hindi"], ["food"], 1200, 4.6, 19),
        ("Debasis Nayak", "Adventure guide.", "Satkosia", ["English"], ["adventure"], 2000, 4.7, 25),
        ("Rohan Sharma", "Rajasthan expert.", "Jaipur", ["English", "Hindi"], ["heritage"], 2000, 4.8, 31),
        ("Lakshmi Nair", "Kerala guide.", "Alleppey", ["English"], ["nature"], 1900, 4.7, 22),
        ("Karthik Iyer", "TN temple guide.", "Madurai", ["English", "Tamil"], ["heritage"], 1700, 4.6, 18),
    ]
    for g in guides:
        db.add(Guide(name=g[0], bio=g[1], location=g[2], languages=g[3], specialties=g[4], price_per_day=g[5], rating=g[6], review_count=g[7], verification_status="verified", image_url="https://i.pravatar.cc/200?u=" + g[0].replace(" ", "")))
    db.commit()

    biz = [
        ("Hotel Kalinga Grand", "hotel", "Business hotel.", "Bhubaneswar", "mid", 1),
        ("Chilika Lake Resort", "hotel", "Eco-resort.", "Chilika", "high", 5),
        ("Dalma Restaurant", "restaurant", "Odia thali.", "Bhubaneswar", "low", 1),
        ("Puri Beach Shack", "restaurant", "Seafood.", "Puri", "low", 2),
        ("Utkal Handicrafts", "shop", "Handloom.", "Cuttack", "low", 6),
        ("Konark Tours", "activity", "Heritage tours.", "Konark", "low", 3),
        ("Similipal Camps", "activity", "Camping.", "Similipal", "mid", 7),
        ("Gopalpur Surf", "activity", "Surf lessons.", "Gopalpur", "low", 9),
        ("Jaipur Heritage Haveli", "hotel", "Royal stay.", "Jaipur", "high", 11),
        ("Rajasthani Thali House", "restaurant", "Thali.", "Jaipur", "low", 11),
        ("Kerala Ayurveda Retreat", "hotel", "Ayurveda resort.", "Alleppey", "high", 16),
        ("Mysore Silk Emporium", "shop", "Silk.", "Mysore", "mid", 21),
        ("Golden Temple Langar", "restaurant", "Free meal.", "Amritsar", "free", 35),
        ("Hyderabad Biryani House", "restaurant", "Biryani.", "Hyderabad", "low", 36),
    ]
    for b in biz:
        db.add(Business(name=b[0], business_type=b[1], description=b[2], address=b[3], price_range=b[4], destination_id=b[5], phone="+91-9999999999", verification_status="verified", image_url="https://picsum.photos/seed/" + b[0].replace(" ", "") + "/400/300"))
    db.commit()

    reviews = [
        ("Amazing temples!", 5, 1), ("Great walk.", 5, 1), ("Beautiful beach.", 4, 2),
        ("Sun Temple stunning.", 5, 3), ("Saw dolphins!", 5, 5), ("Thrilling safari.", 5, 7),
        ("Jaipur dream!", 5, 11), ("Udaipur sunset.", 5, 12), ("Munnar magical.", 5, 15),
        ("Alleppey serene.", 5, 16), ("Hampi majestic.", 4, 19), ("Varanasi divine.", 5, 25),
        ("Taj sunrise!", 5, 26), ("Rafting epic.", 5, 27), ("3 rhinos!", 5, 31),
        ("Golden Temple.", 5, 35), ("Biryani paradise.", 5, 36), ("Peaceful beach.", 4, 9),
        ("Pattachitra fun.", 5, 10), ("Dhauli views.", 4, 4),
    ]
    for r in reviews:
        db.add(Review(author_name="Demo Tourist", destination_id=r[2], rating=r[1], comment=r[0]))
    db.commit()

    metrics = [
        (1, 1200, 180, 850, 45), (2, 2500, 320, 1400, 60), (3, 1800, 250, 1100, 55),
        (4, 150, 20, 90, 8), (5, 600, 85, 420, 25), (6, 320, 45, 210, 12),
        (7, 180, 25, 130, 10), (8, 140, 18, 100, 7), (9, 220, 30, 160, 11), (10, 90, 12, 70, 5),
    ]
    for m in metrics:
        db.add(DemandMetric(destination_id=m[0], visitor_count=m[1], booking_count=m[2], search_count=m[3], recent_review_count=m[4]))
    db.commit()

    print("Seed data loaded. Demo users: tourist@demo.com / demo1234")
    db.close()