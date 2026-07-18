import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./PolicyPage.module.css";
import { POLICY_API } from "../../urls";
import { ChevronDown, ChevronUp, FileText, Calendar, Hash } from "lucide-react";
import { MarkdownBlock } from "../../utils/renderMarkdown";

const PolicyPage = () => {
  const { slug } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(POLICY_API.BY_SLUG(slug));
        if (data.success) {
          setPolicy(data.data);
        } else {
          setError("Policy not found");
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load policy");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [slug]);

  useEffect(() => {
    if (!policy?.sections?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const section of policy.sections) {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [policy]);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileTocOpen(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeleton}>
            <div className={styles.skelBlock} style={{ width: "60%", height: 32 }} />
            <div className={styles.skelBlock} style={{ width: "40%", height: 16, marginTop: 8 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.skelBlock} style={{ width: "100%", height: 80, marginTop: 24 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <FileText size={48} />
            <h2>Policy Not Available</h2>
            <p>{error || "The requested policy could not be found."}</p>
            <Link to="/" className={styles.homeLink}>Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const toc = policy.sections
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>{policy.title}</h1>
          <div className={styles.meta}>
            {policy.version && (
              <span className={styles.metaItem}>
                <Hash size={14} />
                Version {policy.version}
              </span>
            )}
            {policy.updatedAt && (
              <span className={styles.metaItem}>
                <Calendar size={14} />
                Last updated: {new Date(policy.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </motion.div>

        <div className={styles.content}>
          {/* Table of Contents */}
          <motion.nav
            className={`${styles.toc} ${mobileTocOpen ? styles.tocOpen : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              className={styles.tocToggle}
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              aria-label="Toggle table of contents"
            >
              <span>On this page</span>
              {mobileTocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <ul className={styles.tocList}>
              {toc.map((section) => (
                <li key={section.id}>
                  <button
                    className={`${styles.tocLink} ${activeSection === section.id ? styles.tocActive : ""}`}
                    onClick={() => scrollTo(section.id)}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Sections */}
          <motion.div
            className={styles.sections}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {toc.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                className={`${styles.section} ${activeSection === section.id ? styles.sectionActive : ""}`}
              >
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionContent}><MarkdownBlock content={section.content} /></div>
              </section>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
