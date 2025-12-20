import { GraduationCap, Heart, Droplet } from 'lucide-react';

export const causesData = [
    {
        id: 1,
        title: "Education for All",
        badge: "Education",
        desc: "Constructing 12 new classrooms in Tamale and Yendi districts. Providing desks, textbooks, and teaching materials for 2,000+ students.",
        raised: "GH₵7.5M",
        goal: "GH₵10M",
        percent: 75,
        img: "/charity-children-books.jpg",
        color: 'var(--primary-color)',
        organizer: "Charizomai Education Team",
        location: "Northern Region, Ghana",
        story: [
            "In Tamale and Yendi, over 2,000 children attend classes under trees or in buildings with collapsed roofs. During the rainy season, school stops completely.",
            "We're building 12 permanent classrooms across 6 schools. Each classroom will have proper desks, a chalkboard, and a small library. We're also training 15 teachers in modern teaching methods.",
            "So far, we've completed 9 classrooms. The remaining GH₵2.5M will finish the last 3 classrooms and stock all 12 with textbooks and supplies. Classes are already running in the completed buildings."
        ],
        recentDonations: [
            { name: "Kwame Mensah", amount: "GH₵ 500", time: "2 mins ago", comment: "Education is key!" },
            { name: "Sarah O.", amount: "GH₵ 200", time: "15 mins ago", comment: "" },
            { name: "Anonymous", amount: "GH₵ 50", time: "1 hour ago", comment: "For the future." }
        ]
    },
    {
        id: 2,
        title: "Rural Healthcare",
        badge: "Healthcare",
        desc: "Operating 3 mobile clinics in Volta Region. Monthly visits to 25 villages. Free consultations, medications, and maternal health services.",
        raised: "GH₵2.2M",
        goal: "GH₵5M",
        percent: 45,
        img: "/volunteer-female-supplies.jpg",
        color: '#E74C3C',
        organizer: "Dr. Mensah & Team",
        location: "Volta Region, Ghana",
        story: [
            "25 villages in Volta Region are more than 30km from the nearest clinic. Pregnant women often give birth at home without medical help. Basic illnesses go untreated.",
            "Our 3 mobile clinics visit each village monthly. Dr. Mensah's team provides check-ups, vaccinations, malaria treatment, and prenatal care. We've delivered over 50 babies safely in the past year.",
            "We need GH₵2.8M more to keep the clinics running for another 18 months and to purchase a fourth vehicle to reach 10 additional villages."
        ],
        recentDonations: [
            { name: "John Doe", amount: "GH₵ 1,000", time: "10 mins ago", comment: "Great initiative." },
            { name: "Ama K.", amount: "GH₵ 100", time: "1 hour ago", comment: "" }
        ]
    },
    {
        id: 3,
        title: "Clean Water Project",
        badge: "Clean Water",
        desc: "Drilling 8 boreholes in Upper East Region. Installing hand pumps and training local maintenance teams. Serving 4,500 people.",
        raised: "GH₵4.5M",
        goal: "GH₵5M",
        percent: 90,
        img: "/community-outreach-field.jpg",
        color: 'var(--brand-teal)',
        organizer: "Water for Life NGO",
        location: "Upper East Region, Ghana",
        story: [
            "In Bolgatanga district, women and children walk 5km daily to fetch water from contaminated ponds. Waterborne diseases are common, especially during dry season.",
            "We've drilled 7 boreholes so far, each serving 500-600 people. We install Afridev hand pumps and train 3 local technicians per village to maintain them. All 7 are working perfectly.",
            "The final GH₵500K will drill the 8th borehole in Zuarungu village and provide spare parts for all 8 pumps for the next 3 years."
        ],
        recentDonations: [
            { name: "Grace A.", amount: "GH₵ 2,000", time: "5 mins ago", comment: "Water is life." },
            { name: "Anonymous", amount: "GH₵ 500", time: "30 mins ago", comment: "" }
        ]
    },
    {
        id: 4,
        title: "Women Empowerment Program",
        badge: "Empowerment",
        desc: "6-month vocational training in Kumasi. Teaching sewing, hairdressing, and soap making. Providing startup kits and GH₵500-2,000 microloans.",
        raised: "GH₵1.8M",
        goal: "GH₵3M",
        percent: 60,
        img: "/volunteer-organizing-food.jpg",
        color: '#9B59B6',
        organizer: "Women's Development Initiative",
        location: "Ashanti Region, Ghana",
        story: [
            "320 women in Kumasi's Asawase and Aboabo neighborhoods have no income. Most dropped out of school early and lack job skills.",
            "We run 6-month courses in sewing (40 women), hairdressing (30 women), and soap making (25 women). Each graduate gets a startup kit - sewing machine, salon equipment, or soap-making supplies - plus a GH₵500-2,000 loan at 5% interest.",
            "We've trained 95 women so far. 78 are now running their own businesses. The remaining GH₵1.2M will train 100 more women and provide their startup kits."
        ],
        recentDonations: [
            { name: "Akosua M.", amount: "GH₵ 300", time: "20 mins ago", comment: "Empowering women!" },
            { name: "Peter A.", amount: "GH₵ 150", time: "2 hours ago", comment: "" }
        ]
    },
    {
        id: 5,
        title: "Youth Skills Training",
        badge: "Youth Development",
        desc: "3-month tech bootcamp in Accra. Teaching web development, graphic design, and digital marketing. Job placement with 15 partner companies.",
        raised: "GH₵900K",
        goal: "GH₵2M",
        percent: 45,
        img: "/team-prayer-circle.jpg",
        color: '#3498DB',
        organizer: "Youth Futures Ghana",
        location: "Greater Accra, Ghana",
        story: [
            "In Nima and Jamestown, hundreds of youth aged 18-25 are unemployed. Most have finished SHS but can't afford university. They need marketable skills.",
            "Our bootcamp runs 3 months, Monday to Friday. Students learn coding (HTML, CSS, JavaScript), graphic design (Photoshop, Illustrator), or digital marketing. We provide laptops during training.",
            "42 youth have completed the program. 31 got jobs with our partner companies earning GH₵800-1,500/month. 8 started freelancing. We need GH₵1.1M to train 60 more youth."
        ],
        recentDonations: [
            { name: "Kofi T.", amount: "GH₵ 400", time: "1 hour ago", comment: "Investing in youth!" },
            { name: "Anonymous", amount: "GH₵ 100", time: "3 hours ago", comment: "" }
        ]
    },
    {
        id: 6,
        title: "Food Security Initiative",
        badge: "Nutrition",
        desc: "Supporting 80 farmers in Cape Coast with seeds and tools. Running school feeding program for 1,200 children. Daily hot meals during term time.",
        raised: "GH₵3.2M",
        goal: "GH₵6M",
        percent: 53,
        img: "/volunteer-male-supplies.jpg",
        color: '#27AE60',
        organizer: "Food for All Ghana",
        location: "Central Region, Ghana",
        story: [
            "In Cape Coast's Abakam and Pedu communities, children come to school hungry. 80 local farmers struggle with poor yields due to lack of quality seeds and tools.",
            "We give farmers improved maize and vegetable seeds, fertilizer, and basic tools. They sell us their harvest at fair prices. We use this to cook hot meals for 1,200 children in 4 schools - rice with beans, gari and fish, or banku with soup.",
            "We've served over 180,000 meals this year. Teachers report better attendance and concentration. We need GH₵2.8M to continue for another year and expand to 3 more schools."
        ],
        recentDonations: [
            { name: "Abena K.", amount: "GH₵ 600", time: "30 mins ago", comment: "Feed the children!" },
            { name: "Emmanuel O.", amount: "GH₵ 250", time: "1 hour ago", comment: "" }
        ]
    }
];
