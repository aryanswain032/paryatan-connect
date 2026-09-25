from sqlalchemy.orm
import Session
from main import Profile, Destination, Activity, Guide, Business, Review, DemandMetric, hash_pw


def seed_all(SessionLocal):
    db = SessionLocal()
    try:
        existing_count = db.query(Destination).count()
if existing_count >= 30:
    return  # already seeded with full dataset
# If too few destinations, wipe and re-seed with the new 36-destination data
if existing_count > 0:
    db.query(DemandMetric).delete()
    db.query(Review).delete()
    db.query(Activity).delete()
    db.query(Business).delete()
    db.query(Guide).delete()
    db.query(Favorite).delete()
    db.query(Destination).delete()
    db.commit()
    print("Cleared old destinations, re-seeding with full dataset...")

        users = [
            Profile(email="tourist@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Tourist", role="tourist", consent_given=True),
            Profile(email="guide@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Guide", role="guide", consent_given=True),
            Profile(email="business@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Business", role="business", consent_given=True),
            Profile(email="admin@demo.com", hashed_password=hash_pw("demo1234"), full_name="Demo Admin", role="admin", consent_given=True),
        ]
        for u in users:
            db.add(u)
        db.commit()

        dests = [
            ("Bhubaneswar","bhubaneswar","Odisha","Khordha","Temple city with ancient Kalinga architecture.","heritage,culture,food",20.2961,85.8245,"Oct-Mar",False),
            ("Puri","puri","Odisha","Puri","Coastal spiritual town with Jagannath Temple and golden beaches.","spiritual,beach,culture",19.8135,85.8312,"Oct-Feb",False),
            ("Konark","konark","Odisha","Puri","UNESCO Sun Temple with iconic stone chariot architecture.","heritage,culture",19.8876,86.0945,"Oct-Mar",False),
            ("Dhauli","dhauli","Odisha","Khordha","Peace pagoda and Ashokan edicts with hilltop views.","heritage,spiritual",20.1917,85.8400,"Oct-Mar",True),
            ("Chilika Lake","chilika","Odisha","Ganjam","Asia largest brackish lagoon with dolphins and migratory birds.","nature,wildlife",19.7175,85.3206,"Nov-Feb",False),
            ("Cuttack","cuttack","Odisha","Cuttack","Silver city with riverside forts and filigree crafts.","heritage,shopping,food",20.4625,85.8830,"Oct-Mar",True),
            ("Similipal","similipal","Odisha","Mayurbhanj","Tiger reserve and biosphere with waterfalls and tribal culture.","wildlife,nature,adventure",21.9500,86.3167,"Nov-Mar",True),
            ("Satkosia","satkosia","Odisha","Angul","Gorge sanctuary on Mahanadi, ideal for river safaris.","nature,wildlife,adventure",20.6500,84.9333,"Oct-Feb",True),
            ("Gopalpur","gopalpur","Odisha","Ganjam","Quiet beach town with colonial charm and lighthouse.","beach,wellness",19.2667,84.9167,"Oct-Mar",True),
            ("Raghurajpur","raghurajpur","Odisha","Puri","Heritage crafts village for Pattachitra paintings and dance.","culture,heritage,shopping",19.8547,85.8622,"Oct-Mar",True),
            ("Jaipur","jaipur","Rajasthan","Jaipur","The Pink City with Amber Fort, Hawa Mahal, and royal palaces.","heritage,culture,shopping",26.9124,75.7873,"Oct-Mar",False),
            ("Udaipur","udaipur","Rajasthan","Udaipur","City of Lakes with palaces and sunset boat rides.","heritage,wellness,culture",24.5854,73.7125,"Oct-Mar",True),
            ("Jaisalmer","jaisalmer","Rajasthan","Jaisalmer","Golden desert city with sand dunes and camel safaris.","heritage,adventure,culture",26.9157,70.9083,"Nov-Feb",True),
            ("Ranthambore","ranthambore","Rajasthan","Sawai Madhopur","Famous tiger reserve with historic fort views.","wildlife,nature",26.0173,76.5026,"Oct-Apr",False),
            ("Munnar","munnar","Kerala","Idukki","Rolling tea plantations, misty hills, and spice gardens.","nature,wellness",10.0889,77.0595,"Sep-May",False),
            ("Alleppey","alleppey","Kerala","Alappuzha","Venice of the East with backwater houseboat cruises.","nature,wellness,culture",9.4981,76.3388,"Sep-Mar",False),
            ("Kovalam","kovalam","Kerala","Thiruvananthapuram","Crescent beaches and Ayurvedic wellness retreats.","beach,wellness",8.4004,76.9787,"Oct-Mar",True),
            ("Wayanad","wayanad","Kerala","Wayanad","Western Ghats forests, tribal culture, and ancient caves.","nature,wildlife,adventure",11.6854,76.1320,"Oct-May",True),
            ("Hampi","hampi","Karnataka","Vijayanagara","UNESCO ruins of the Vijayanagara empire.","heritage,culture",15.3350,76.4600,"Oct-Feb",False),
            ("Coorg","coorg","Karnataka","Kodagu","Coffee plantations, misty hills, and Kaveri river.","nature,wellness",12.3375,75.8069,"Oct-Mar",True),
            ("Mysore","mysore","Karnataka","Mysuru","Royal Mysore Palace, Chamundi Hills, and silk sarees.","heritage,culture,shopping",12.2958,76.6394,"Oct-Feb",True),
            ("Madurai","madurai","Tamil Nadu","Madurai","Ancient temple city with Meenakshi Amman Temple.","heritage,spiritual,culture",9.9252,78.1198,"Oct-Mar",False),
            ("Mahabalipuram","mahabalipuram","Tamil Nadu","Chengalpattu","UNESCO shore temples and rock-cut monuments.","heritage,culture",12.6208,80.1945,"Nov-Feb",True),
            ("Ooty","ooty","Tamil Nadu","Nilgiris","Nilgiri hill station with tea gardens and toy train.","nature,wellness",11.4102,76.6950,"Mar-Jun",True),
            ("Varanasi","varanasi","Uttar Pradesh","Varanasi","Ganga ghats, evening aarti, and ancient spiritual heritage.","spiritual,heritage,culture",25.3176,82.9739,"Oct-Mar",False),
            ("Agra","agra","Uttar Pradesh","Agra","Taj Mahal, Agra Fort, and Mughal heritage.","heritage,culture",27.1767,78.0081,"Oct-Mar",False),
            ("Rishikesh","rishikesh","Uttarakhand","Dehradun","Yoga capital of the world, Ganga aarti, river rafting.","wellness,adventure,spiritual",30.0869,78.2676,"Sep-Apr",True),
            ("North Goa","north-goa","Goa","North Goa","Baga, Calangute beaches, Portuguese forts, water sports.","beach,adventure,food",15.5527,73.7517,"Nov-Feb",False),
            ("Manali","manali","Himachal Pradesh","Kullu","Snow peaks, Solang Valley, and old Manali cafes.","adventure,nature",32.2432,77.1892,"Mar-Jun",True),
            ("Darjeeling","darjeeling","West Bengal","Darjeeling","Tea gardens, toy train, and Himalayan views.","nature,wellness,culture",27.0360,88.2627,"Mar-May",True),
            ("Kaziranga","kaziranga","Assam","Golaghat","UNESCO home of the one-horned rhino.","wildlife,nature",26.5775,93.1711,"Nov-Apr",False),
            ("Ajanta Ellora","ajanta-ellora","Maharashtra","Aurangabad","UNESCO rock-cut caves with ancient Buddhist art.","heritage,culture",20.5519,75.7033,"Oct-Mar",True),
            ("Rann of Kutch","rann-of-kutch","Gujarat","Kutch","White salt desert, full moon nights, and Kutchi crafts.","nature,culture,shopping",23.7337,69.8597,"Nov-Feb",True),
            ("Khajuraho","khajuraho","Madhya Pradesh","Chhatarpur","UNESCO temples with intricate carvings.","heritage,culture",24.8318,79.9199,"Oct-Mar",False),
            ("Amritsar","amritsar","Punjab","Amritsar","Golden Temple, Wagah border, and Punjabi cuisine.","spiritual,food,culture",31.6340,74.8723,"Oct-Mar",True),
            ("Hyderabad","hyderabad","Telangana","Hyderabad","Charminar, Golconda Fort, biryani and pearls.","heritage,food,shopping",17.3850,78.4867,"Oct-Feb",True),
        ]
        for d in dests:
            db.add(Destination(
                name=d[0], slug=d[1], state=d[2], district=d[3],
                description=d[4], categories=d[5].split(","),
                latitude=d[6], longitude=d[7], best_season=d[8],
                is_emerging=d[9],
                image_url="https://picsum.photos/seed/" + d[1] + "/800/500"
            ))
        db.commit()

        acts = [
            (1,"Lingaraj Temple Heritage Walk","Guided walk through 11th-century temple complex.","heritage",120,"300-800 INR"),
            (1,"Odissi Dance Performance","Evening classical Odissi dance show.","culture",90,"500-1200 INR"),
            (2,"Jagannath Temple Darshan","Guided spiritual visit with priest.","spiritual",120,"Free"),
            (2,"Puri Beach Sunset Walk","Guided sunset walk along golden beach.","beach",90,"200-500 INR"),
            (3,"Sun Temple Architecture Tour","Deep-dive into Konark stone chariot.","heritage",150,"400-900 INR"),
            (5,"Chilika Dolphin Boat Safari","Morning boat ride to spot dolphins.","wildlife",180,"1500-2500 INR"),
            (7,"Similipal Jungle Safari","Jeep safari in tiger reserve.","adventure",300,"2000-3500 INR"),
            (8,"Satkosia River Cruise","Boat cruise through Mahanadi gorge.","adventure",150,"1000-1800 INR"),
            (11,"Jaipur Amber Fort Tour","Guided tour of Amber Fort and Hawa Mahal.","heritage",240,"500-1500 INR"),
            (11,"Rajasthani Food Walk","Street food and traditional thali tour.","food",120,"800-1500 INR"),
            (12,"Udaipur Lake Palace Boat Ride","Sunset boat ride on Lake Pichola.","heritage",90,"1000-2000 INR"),
            (14,"Ranthambore Tiger Safari","Morning jeep safari in tiger reserve.","wildlife",240,"2000-4000 INR"),
            (15,"Munnar Tea Plantation Walk","Walk through tea gardens with tasting.","nature",120,"300-800 INR"),
            (16,"Alleppey Backwater Houseboat","Overnight houseboat cruise.","nature",720,"5000-12000 INR"),
            (17,"Kovalam Ayurvedic Massage","Traditional Kerala Ayurveda session.","wellness",90,"1500-3000 INR"),
            (18,"Wayanad Wildlife Safari","Safari through Western Ghats forests.","wildlife",180,"1500-3000 INR"),
            (19,"Hampi Ruins Cycling Tour","Cycle through Vijayanagara ruins.","heritage",240,"500-1200 INR"),
            (21,"Mysore Palace Sound & Light","Evening sound and light show.","heritage",60,"200-500 INR"),
            (22,"Madurai Temple Walk","Guided Meenakshi Amman Temple tour.","heritage",120,"300-800 INR"),
            (23,"Mahabalipuram Shore Temple Tour","Walk through UNESCO shore temples.","heritage",120,"300-700 INR"),
            (25,"Varanasi Ganga Aarti","Evening Ganga aarti at Dashashwamedh Ghat.","spiritual",120,"Free"),
            (26,"Taj Mahal Sunrise Tour","Early morning Taj Mahal visit.","heritage",180,"500-1500 INR"),
            (27,"Rishikesh River Rafting","White water rafting on Ganga.","adventure",180,"1000-2500 INR"),
            (28,"North Goa Beach Hopping","Visit Baga, Calangute, Anjuna beaches.","beach",240,"800-2000 INR"),
            (29,"Manali Solang Valley Tour","Snow activities and paragliding.","adventure",300,"1500-3500 INR"),
            (30,"Darjeeling Toy Train Ride","Heritage Darjeeling Himalayan Railway ride.","culture",120,"800-2000 INR"),
            (31,"Kaziranga Elephant Safari","Early morning elephant safari to see rhinos.","wildlife",120,"1500-3000 INR"),
            (32,"Ajanta Ellora Caves Tour","Guided tour of ancient rock-cut caves.","heritage",240,"600-1500 INR"),
            (33,"Rann of Kutch White Desert","Visit the white salt desert at full moon.","nature",180,"1000-2000 INR"),
            (34,"Khajuraho Temple Tour","Guided tour of UNESCO temples.","heritage",150,"400-1000 INR"),
            (35,"Golden Temple Visit","Darshan at the Golden Temple.","spiritual",120,"Free"),
            (36,"Hyderabad Biryani Trail","Biryani and street food walk.","food",120,"800-1500 INR"),
        ]
        for a in acts:
            db.add(Activity(destination_id=a[0], name=a[1], description=a[2], category=a[3], duration_minutes=a[4], price_range=a[5]))
        db.commit()

        guides = [
            ("Rajesh Mohanty","20 years guiding heritage tours across Odisha.","Bhubaneswar",["English","Hindi","Odia"],["heritage","culture"],1800,4.8,34),
            ("Priya Das","Specialist in Odissi dance and craft villages.","Puri",["English","Odia"],["culture","shopping"],1500,4.7,28),
            ("Sanjay Behera","Wildlife and nature guide at Chilika and Similipal.","Chilika",["English","Hindi","Odia"],["wildlife","nature"],2200,4.9,42),
            ("Anita Sahoo","Food walks and street food experiences.","Cuttack",["English","Hindi"],["food","culture"],1200,4.6,19),
            ("Debasis Nayak","Adventure guide for trekking and river safaris.","Satkosia",["English","Odia"],["adventure","nature"],2000,4.7,25),
            ("Rohan Sharma","Rajasthan heritage and desert expert.","Jaipur",["English","Hindi"],["heritage","culture"],2000,4.8,31),
            ("Lakshmi Nair","Kerala backwater and Ayurveda guide.","Alleppey",["English","Malayalam"],["nature","wellness"],1900,4.7,22),
            ("Karthik Iyer","Tamil Nadu temple trails and food.","Madurai",["English","Tamil"],["heritage","food"],1700,4.6,18),
        ]
        for g in guides:
            db.add(Guide(name=g[0], bio=g[1], location=g[2], languages=g[3], specialties=g[4], price_per_day=g[5], rating=g[6], review_count=g[7], verification_status="verified", image_url="https://i.pravatar.cc/200?u=" + g[0].replace(" ","")))
        db.commit()

        biz = [
            ("Hotel Kalinga Grand","hotel","Comfortable business hotel in central Bhubaneswar.","Bhubaneswar","mid",1),
            ("Chilika Lake Resort","hotel","Eco-resort facing Chilika lagoon.","Chilika","high",5),
            ("Dalma Restaurant","restaurant","Authentic Odia thali and vegetarian cuisine.","Bhubaneswar","low",1),
            ("Puri Beach Shack","restaurant","Seafood and Oriya street food by the sea.","Puri","low",2),
            ("Utkal Handicrafts Emporium","shop","Handloom, silver filigree and Pattachitra.","Cuttack","low",6),
            ("Konark Adventure Tours","activity","Guided heritage and cycling tours.","Konark","low",3),
            ("Similipal Nature Camps","activity","Jungle camping and safari packages.","Similipal","mid",7),
            ("Gopalpur Surf School","activity","Beginner and intermediate surf lessons.","Gopalpur","low",9),
            ("Jaipur Heritage Haveli","hotel","Royal heritage hotel in old Jaipur.","Jaipur","high",11),
            ("Rajasthani Thali House","restaurant","Traditional Rajasthani thali and sweets.","Jaipur","low",11),
            ("Kerala Ayurveda Retreat","hotel","Backwater resort with Ayurveda spa.","Alleppey","high",16),
            ("Mysore Silk Emporium","shop","Authentic Mysore silk sarees and handicrafts.","Mysore","mid",21),
            ("Golden Temple Langar","restaurant","Free community meal at Golden Temple.","Amritsar","free",35),
            ("Hyderabad Biryani House","restaurant","Authentic Hyderabadi dum biryani.","Hyderabad","low",36),
        ]
        for b in biz:
            db.add(Business(name=b[0], business_type=b[1], description=b[2], address=b[3], price_range=b[4], destination_id=b[5], phone="+91-9999999999", verification_status="verified", image_url="https://picsum.photos/seed/" + b[0].replace(" ","") + "/400/300"))
        db.commit()

        reviews = [
            ("Amazing temples and food!",5,1),("Great heritage walk with Rajesh.",5,1),
            ("Beach was beautiful at sunset.",4,2),("Sun Temple is breathtaking.",5,3),
            ("Saw dolphins! Magical experience.",5,5),("Silver filigree workshop was fun.",4,6),
            ("Safari was thrilling.",5,7),("Quiet and peaceful beach.",4,9),
            ("Loved the Pattachitra class.",5,10),("Dhauli pagoda has great views.",4,4),
            ("Jaipur is a dream!",5,11),("Udaipur sunset was unforgettable.",5,12),
            ("Munnar tea gardens are magical.",5,15),("Alleppey houseboat was serene.",5,16),
            ("Hampi ruins are majestic.",4,19),("Varanasi aarti gave me goosebumps.",5,25),
            ("Taj Mahal at sunrise - beyond words.",5,26),("Rishikesh rafting was epic.",5,27),
            ("Kaziranga safari - saw 3 rhinos!",5,31),("Amritsar Golden Temple is divine.",5,35),
        ]
        for r in reviews:
            db.add(Review(author_name="Demo Tourist", destination_id=r[2], rating=r[1], comment=r[0]))
        db.commit()

        metrics = [
            (1, 1200, 180, 850, 45),(2, 2500, 320, 1400, 60),(3, 1800, 250, 1100, 55),
            (4, 150, 20, 90, 8),(5, 600, 85, 420, 25),(6, 320, 45, 210, 12),
            (7, 180, 25, 130, 10),(8, 140, 18, 100, 7),(9, 220, 30, 160, 11),(10, 90, 12, 70, 5),
        ]
        for m in metrics:
            db.add(DemandMetric(destination_id=m[0], visitor_count=m[1], booking_count=m[2], search_count=m[3], recent_review_count=m[4]))
        db.commit()
        print("Seed data loaded. Demo users: tourist@demo.com / demo1234")
    finally:
        db.close()
