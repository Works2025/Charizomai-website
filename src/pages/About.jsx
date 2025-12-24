import { motion } from 'framer-motion';
import { Heart, Users, Globe, Award, Target, Eye } from 'lucide-react';
import FundraisersCarousel from '../components/FundraisersCarousel';

export default function About() {
    return (
        <main>
            {/* Hero Section with Background Image */}
            <section style={{
                background: 'linear-gradient(rgba(44, 62, 80, 0.85), rgba(44, 62, 80, 0.85)), url(/about-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '10rem 0 8rem',
                position: 'relative',
                color: 'white'
            }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: 800,
                            margin: '0 0 1.5rem 0',
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                        }}>
                            About Charizomai Foundation
                        </h1>
                        <p style={{
                            fontSize: '1.4rem',
                            lineHeight: 1.7,
                            maxWidth: '700px',
                            margin: '0 auto',
                            opacity: 0.95,
                            textShadow: '0 1px 10px rgba(0,0,0,0.2)'
                        }}>
                            Building stronger communities through education, healthcare, and sustainable development since 2015.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section style={{ padding: '3rem 0', background: 'white' }}>
                <div className="container">
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ marginBottom: '2rem' }}
                        >
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                                Our Mission & Vision
                            </h2>
                        </motion.div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div style={{
                                    borderLeft: '4px solid var(--primary-color)',
                                    paddingLeft: '2rem',
                                    marginBottom: '2rem'
                                }}>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                                        Mission
                                    </h3>
                                    <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                                        To provide sustainable support to underserved communities in Ghana through education,
                                        healthcare access, and infrastructure development. We work directly with local leaders
                                        to ensure our programs meet real needs and create lasting change.
                                    </p>
                                </div>

                                <div style={{
                                    borderLeft: '4px solid var(--brand-teal)',
                                    paddingLeft: '2rem'
                                }}>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                                        Vision
                                    </h3>
                                    <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                                        A Ghana where every child can attend school, every family has access to basic healthcare,
                                        and every community has clean water. We believe in empowering people with the resources
                                        they need to build their own futures.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    src="/team-prayer-circle.jpg"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        minHeight: '400px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                    }}
                                    alt="Community work"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section style={{ padding: '3rem 0', background: 'white' }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Our Core Values
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        alignItems: 'stretch'
                    }}>
                        {[
                            {
                                icon: <Heart size={32} />,
                                color: 'var(--primary-color)',
                                title: "Compassion",
                                desc: "We lead with empathy, putting community needs at the heart of every decision."
                            },
                            {
                                icon: <Users size={32} />,
                                color: 'var(--brand-teal)',
                                title: "Community",
                                desc: "We work alongside communities. Local voices guide our projects."
                            },
                            {
                                icon: <Globe size={32} />,
                                color: 'var(--brand-light-blue)',
                                title: "Impact",
                                desc: "Rooted in Ghana, our vision extends globally through shared knowledge."
                            },
                            {
                                icon: <Award size={32} />,
                                color: 'var(--primary-color)',
                                title: "Transparency",
                                desc: "Every donation is tracked and reported with full accountability."
                            }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                className="hover-card"
                                style={{
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    background: `${value.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.25rem',
                                    color: value.color
                                }}>
                                    {value.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {value.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section style={{ padding: '3rem 0', background: 'var(--bg-light)' }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            What We Do
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            Our work focuses on three key areas
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '2.5rem',
                        maxWidth: '1100px',
                        margin: '0 auto',
                        alignItems: 'stretch'
                    }}>
                        {[
                            {
                                title: "Education",
                                desc: "Building schools and providing scholarships to children in rural areas. We've helped over 5,000 students access quality education."
                            },
                            {
                                title: "Healthcare",
                                desc: "Operating mobile clinics that bring doctors and medicine to remote villages. Monthly health camps serve 500+ families."
                            },
                            {
                                title: "Clean Water",
                                desc: "Drilling boreholes and installing water systems in drought-affected regions. 50+ communities now have access to safe water."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="hover-card"
                                style={{
                                    padding: '2.5rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section style={{
                background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1a252f 100%)',
                padding: '3rem 0',
                color: 'white'
            }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', marginBottom: '2rem' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>Our Impact Since 2015</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Real numbers, real change</p>
                    </motion.div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '3rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {[
                            { value: "GH₵50M+", label: "Raised for Communities" },
                            { value: "10,000+", label: "Lives Directly Impacted" },
                            { value: "500+", label: "Villages Reached" },
                            { value: "50+", label: "Schools Built" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                style={{ textAlign: 'center' }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, type: 'spring' }}
                                viewport={{ once: true }}
                            >
                                <h3 style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 800,
                                    color: 'var(--primary-color)',
                                    marginBottom: '0.5rem',
                                    textShadow: '0 2px 10px rgba(230, 126, 34, 0.3)'
                                }}>
                                    {stat.value}
                                </h3>
                                <p style={{ fontSize: '1.1rem', opacity: 0.95, fontWeight: 500 }}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section style={{ padding: '3rem 0', background: 'white' }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Meet Our Leadership
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            The passionate minds behind Charizomai Foundation
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        alignItems: 'stretch'
                    }}>
                        {[
                            {
                                name: "Isaac Atta Yeboah",
                                role: "Founder",
                                desc: "15+ years leading strategic vision and partnerships.",
                                img: "/isaac-atta-yeboah-v2.jpg"
                            },
                            {
                                name: "Samuel Appiah Ajei",
                                role: "Executive Director",
                                desc: "Manages field teams and project execution.",
                                img: "/samuel-appiah-ajei.jpg"
                            },
                            {
                                name: "Jonathan Odum",
                                role: "Operations Director",
                                desc: "Connects with communities and amplifies voices.",
                                img: "/jonathan-odum.jpg"
                            },
                            {
                                name: "Gloria Owusu Ansah",
                                role: "Finance Director",
                                desc: "Ensures transparency and maximum impact.",
                                img: "/gloria-owusu-ansah-v2.jpg"
                            }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                className="hover-card"
                                style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    margin: '0 auto 1.25rem',
                                    border: '3px solid var(--bg-cream)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                                }}>
                                    <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    {member.name}
                                </h3>
                                <p style={{
                                    color: 'var(--primary-color)',
                                    fontWeight: 600,
                                    marginBottom: '0.75rem',
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {member.role}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {member.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fundraisers Carousel */}
            <FundraisersCarousel />

            {/* Call to Action */}
            <section style={{
                background: 'linear-gradient(135deg, var(--bg-cream) 0%, white 100%)',
                padding: '3rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <motion.div
                        style={{ maxWidth: '800px', margin: '0 auto' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            Join Our Mission
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                            Whether through donations, volunteering, or spreading the word, you can be part of the change.
                            Together, we can build a better future for communities in need.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/donate" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '1.1rem 2.8rem' }}>
                                Make a Donation
                            </a>
                            <a href="/contact" className="btn-light" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '1.1rem 2.8rem' }}>
                                Get Involved
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
