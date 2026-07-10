"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type {
  Achievement,
  CvData,
  DeployedProject,
  ProfileData,
  Project,
  SectionId,
} from "@/lib/content";
import { SECTIONS } from "@/lib/content";
import { getAge, getAgePhrase, getBirthdayLabel } from "@/lib/age";
import { getDisplaySkills } from "@/lib/skills";
import CharacterAvatar from "./CharacterAvatar";
import CharacterAvatarLite from "./CharacterAvatarLite";
import AchievementsSection from "./AchievementsSection";
import DeployedProjects from "./DeployedProjects";
import ProjectDetailModal from "./ProjectDetailModal";
import SocialLinks from "./SocialLinks";
import CvOpenButton from "./CvOpenButton";

type ScrollSectionsProps = {
  cv: CvData;
  projects: Project[];
  achievements: Achievement[];
  deployed: DeployedProject[];
  interviews: any[];
  profile: ProfileData;
  instagramUrl: string;
  mouseX: number;
  mouseY: number;
  lite?: boolean;
};

type LearningSource = {
  name: string;
  focus: string;
};

function displayName(raw: string) {
  return raw
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function SectionPanel({
  id,
  children,
  className = "",
}: {
  id: SectionId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-panel${className ? ` ${className}` : ""}`}
      data-section={id}
    >
      <div className="scroll-panel-inner">{children}</div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeUpLite = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i * 0.02, 0.1),
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function ScrollSections({
  cv,
  projects,
  achievements,
  deployed,
  interviews,
  profile,
  instagramUrl,
  mouseX,
  mouseY,
  lite = false,
}: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId>("hero");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const fade = lite ? fadeUpLite : fadeUp;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const parallaxX = useTransform(scrollYProgress, [0, 1], [0, mouseX * -8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.92]);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const age = getAge();
  const agePhrase = getAgePhrase();
  const birthday = getBirthdayLabel();
  const name = displayName(cv.name);
  const heroTitle = profile.title || cv.title;
  const heroHeadline = profile.headline || cv.summary;
  const learning = (cv as CvData & { learningSources?: LearningSource[] })
    .learningSources;
  const displaySkills = getDisplaySkills(
    cv as CvData & { skillGroups?: { label: string; items: string[] }[] }
  );
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) {
          setActive(visible.target.getAttribute("data-section") as SectionId);
        }
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    root.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="scroll-root"
      style={{ x: lite ? 0 : parallaxX }}
    >
      <nav className="section-nav" aria-label="Portfolio sections">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "active" : ""}
          >
            {s.label}
          </a>
        ))}
        <CvOpenButton variant="nav" />
      </nav>

      <aside className="scroll-rail">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={
              lite ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(8px)" }
            }
            animate={
              lite ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            exit={lite ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{
              duration: lite ? 0.2 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rail-card glass"
          >
            <p className="rail-label">
              {SECTIONS.find((s) => s.id === active)?.label}
            </p>
            {active === "hero" && (
              <>
                <h2>{name}</h2>
                <p>{agePhrase}</p>
                <p className="rail-sub">{heroTitle}</p>
              </>
            )}
            {active === "about" && (
              <p>
                {agePhrase} · {birthday}
              </p>
            )}
            {active === "skills" && (
              <ul className="tag-cloud">
                {cv.skills.slice(0, 8).map((sk) => (
                  <li key={sk}>{sk}</li>
                ))}
              </ul>
            )}
            {active === "achievements" && (
              <p>{achievements.length} highlights · @alihamiehlb</p>
            )}
            {active === "projects" && (
              <p>{projects.length} builds · tap a card for the full story</p>
            )}
            {active === "interviews" && (
              <p>{interviews.length} TV appearances & Interviews</p>
            )}
            {active === "contact" && (
              <ul className="contact-mini">
                {cv.email && <li>{cv.email}</li>}
                {cv.phone && <li>{cv.phone}</li>}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </aside>

      <SectionPanel id="hero" className="hero-panel">
        <motion.div
          className="hero-grid"
          style={lite ? undefined : { opacity: heroOpacity }}
        >
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: lite ? 0.03 : 0.08 },
              },
            }}
          >
            <motion.span className="eyebrow" variants={fade} custom={0}>
              Developer · Maker · {age} yrs
            </motion.span>
            <motion.h1 variants={fade} custom={1}>
              {name}
            </motion.h1>
            <motion.p className="lead" variants={fade} custom={2}>
              {heroTitle}
            </motion.p>
            {profile.aiDiploma && (
              <motion.p className="hero-diploma" variants={fade} custom={3}>
                {profile.aiDiploma}
              </motion.p>
            )}
            <motion.p className="hero-headline" variants={fade} custom={4}>
              {heroHeadline}
            </motion.p>
            <motion.p className="age-badge" variants={fade} custom={5}>
              {agePhrase} · born {birthday}
            </motion.p>
            <motion.p className="hint" variants={fade} custom={6}>
              {lite
                ? "Portrait plays automatically · scroll to explore"
                : "Portrait loops on its own · move to steer · pauses when you scroll away"}
            </motion.p>
            <motion.div variants={fade} custom={7}>
              <SocialLinks profile={profile} compact lite={lite} />
            </motion.div>
            <motion.div className="hero-cta-row" variants={fade} custom={8}>
              <a href="#projects" className="btn-primary">
                View work
              </a>
              <CvOpenButton variant="primary" />
              <a href="#contact" className="btn-ghost">
                Contact
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={lite ? { opacity: 0, y: 8 } : { opacity: 0, scale: 0.92, rotateY: -12 }}
            animate={lite ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              duration: lite ? 0.35 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {lite ? (
              <CharacterAvatarLite />
            ) : (
              <CharacterAvatar mouseX={mouseX} mouseY={mouseY} />
            )}
          </motion.div>
        </motion.div>
      </SectionPanel>

      <SectionPanel id="about">
        <motion.h2
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          About
        </motion.h2>
        <motion.p
          className="age-line"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          I&apos;m <strong>{agePhrase}</strong> (born {birthday}).
        </motion.p>
        <motion.p
          className="body-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {cv.summary}
        </motion.p>

        {learning && learning.length > 0 && (
          <motion.div
            className="learning-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3>Where I&apos;ve learned</h3>
            <div className="learning-grid">
              {learning.map((src, i) => (
                <motion.article
                  key={src.name}
                  className="learning-card glass"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: lite ? i * 0.03 : i * 0.06 }}
                  whileHover={lite ? undefined : { y: -4 }}
                >
                  <h4>{src.name}</h4>
                  <p>{src.focus}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {cv.education.length > 0 && (
          <ul className="edu-list">
            {cv.education.map((e) => (
              <li key={e.school}>{e.school}</li>
            ))}
          </ul>
        )}
      </SectionPanel>

      <SectionPanel id="skills">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Skills
        </motion.h2>
        <motion.div
          className="skills-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            visible: {
              transition: { staggerChildren: lite ? 0.015 : 0.025 },
            },
          }}
        >
          {displaySkills.map((skill, i) => (
            <motion.span
              key={`${skill}-${i}`}
              className="skill-chip"
              variants={fade}
              custom={i % 12}
              whileHover={lite ? undefined : { scale: 1.08, y: -3 }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </SectionPanel>

      <AchievementsSection
        achievements={achievements}
        instagramUrl={instagramUrl}
        lite={lite}
      />

      <SectionPanel id="projects">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Selected work
        </motion.h2>
        <motion.p
          className="section-sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Apps, sites, automation, and hardware — tap a card for the full
          breakdown.
        </motion.p>

        <DeployedProjects
          projects={deployed}
          githubUrl={profile.github}
          lite={lite}
        />

        <motion.div
          className="project-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: { staggerChildren: lite ? 0.03 : 0.06 },
            },
          }}
        >
          {featured.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              featured
              lite={lite}
              fade={fade}
              onOpen={() => setSelectedProject(p)}
            />
          ))}
        </motion.div>
        {rest.length > 0 && (
          <>
            <h3 className="projects-more-title">More projects</h3>
            <div className="project-grid secondary">
              {rest.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  lite={lite}
                  fade={fade}
                  onOpen={() => setSelectedProject(p)}
                />
              ))}
            </div>
          </>
        )}
      </SectionPanel>

      {interviews && interviews.length > 0 && (
        <SectionPanel id="interviews">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Interviews
          </motion.h2>
          <motion.p
            className="section-sub"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Media appearances, TV segments, and interviews.
          </motion.p>
          <div className="project-grid mt-4">
            {interviews.map((int: any, i: number) => (
              <motion.a
                key={int.id}
                href={int.url}
                target="_blank"
                rel="noreferrer"
                className="project-card glass"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={lite ? undefined : { y: -8, boxShadow: "0 32px 64px rgba(42,154,173,0.2)" }}
              >
                <div className="project-meta">
                  <h3>{int.title}</h3>
                  <span className="badge">{int.channel}</span>
                </div>
                <p className="project-desc">{int.description}</p>
                <div className="tags">
                  <span>{int.date}</span>
                </div>
                <span className="project-cta">Watch Video →</span>
              </motion.a>
            ))}
          </div>
        </SectionPanel>
      )}

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <SectionPanel id="contact">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Let&apos;s connect
        </motion.h2>
        <motion.p className="section-sub" whileInView={{ opacity: 1 }}>
          {agePhrase} · Lebanon · Founder of{" "}
          <a
            href={profile.printsLb.url}
            target="_blank"
            rel="noreferrer"
            className="insta-link"
          >
            {profile.printsLb.name}
          </a>
        </motion.p>

        <SocialLinks profile={profile} lite={lite} />

        <motion.div
          className="contact-cv-row"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CvOpenButton variant="card" />
        </motion.div>

        <motion.div
          className="contact-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {cv.email && (
            <motion.a
              className="contact-card glass"
              href={`mailto:${cv.email}`}
              variants={fade}
              custom={0}
              whileHover={lite ? undefined : { y: -4 }}
            >
              Email
              <span>{cv.email}</span>
            </motion.a>
          )}
          {cv.phone && (
            <motion.a
              className="contact-card glass"
              href={`tel:${cv.phone.replace(/\s/g, "")}`}
              variants={fade}
              custom={1}
              whileHover={lite ? undefined : { y: -4 }}
            >
              Phone
              <span>{cv.phone}</span>
            </motion.a>
          )}
        </motion.div>
      </SectionPanel>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  featured,
  lite,
  fade,
  onOpen,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  lite?: boolean;
  fade: typeof fadeUp;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      className={`project-card glass${featured ? " featured" : ""}`}
      variants={fade}
      custom={index}
      whileHover={
        lite
          ? undefined
          : { y: -8, boxShadow: "0 32px 64px rgba(42,154,173,0.2)" }
      }
      whileTap={{ scale: lite ? 0.99 : 0.98 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen();
      }}
    >
      <motion.div className="project-meta">
        <h3>{project.title}</h3>
        {featured && <span className="badge">Featured</span>}
      </motion.div>
      <p className="project-desc">{project.description}</p>
      <div className="tags">
        {project.tags.slice(0, 4).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <span className="project-cta">Open project →</span>
    </motion.button>
  );
}
