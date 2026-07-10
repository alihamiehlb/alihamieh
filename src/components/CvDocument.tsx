import { getAge, getBirthdayLabel } from "@/lib/age";
import CvToolbar from "./CvToolbar";

export type CvDocumentData = {
  name: string;
  title: string;
  tagline?: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  instagram?: string;
  linktree?: string;
  location: string;
  summary: string;
  highlights?: string[];
  experience: { title: string; period?: string; summary: string }[];
  education: { school: string; detail: string }[];
  skillGroups?: { label: string; items: string[] }[];
  selectedProjects?: { name: string; role: string; url?: string }[];
  certifications?: string[];
  achievements?: { title: string; subtitle?: string; summary: string }[];
  interviews?: { title: string; url: string }[];
  lastUpdated?: string;
  documentFileName?: string;
};

type CvDocumentProps = {
  cv: CvDocumentData;
  showToolbar?: boolean;
};

export default function CvDocument({ cv, showToolbar = true }: CvDocumentProps) {
  const age = getAge();
  const birthday = getBirthdayLabel();
  const fileName = cv.documentFileName || "Ali_Hamieh_CV_2026.html";

  return (
    <div className="cv-page">
      {showToolbar && <CvToolbar fileName={fileName} />}

      <article className="cv-sheet" id="cv-document">
        <header className="cv-header">
          <div>
            <h1>{cv.name}</h1>
            {cv.tagline && <p className="cv-tagline">{cv.tagline}</p>}
            <p className="cv-title-line">
              {cv.title} · {age} years old · {cv.location}
            </p>
          </div>
          <address className="cv-contact">
            <a href={`mailto:${cv.email}`}>{cv.email}</a>
            <br />
            <a href={`tel:${cv.phone.replace(/\s/g, "")}`}>{cv.phone}</a>
            <br />
            <a href={cv.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            {" · "}
            <a href={cv.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {cv.linktree && (
              <>
                <br />
                <a href={cv.linktree} target="_blank" rel="noreferrer">
                  Linktree
                </a>
              </>
            )}
          </address>
        </header>

        <div className="cv-body">
          <aside className="cv-sidebar">
            {cv.skillGroups?.map((group) => (
              <div key={group.label} className="cv-skill-group">
                <h3>{group.label}</h3>
                <div className="cv-chips">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}

            {cv.certifications && cv.certifications.length > 0 && (
              <section className="cv-section">
                <h2>Certifications</h2>
                <ul className="cv-cert-list">
                  {cv.certifications.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          <main className="cv-main">
            <section className="cv-section">
              <h2>Profile</h2>
              <p className="cv-summary">{cv.summary}</p>
            </section>

            {cv.highlights && cv.highlights.length > 0 && (
              <section className="cv-section">
                <h2>Highlights</h2>
                <ul className="cv-highlight-list">
                  {cv.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            {cv.achievements && cv.achievements.length > 0 && (
              <section className="cv-section">
                <h2>Achievements</h2>
                {cv.achievements.map((ach) => (
                  <div key={ach.title} className="cv-entry">
                    <div className="cv-entry-head">
                      <strong>{ach.title}</strong>
                      {ach.subtitle && <em>{ach.subtitle}</em>}
                    </div>
                    <p>{ach.summary}</p>
                  </div>
                ))}
              </section>
            )}

            <section className="cv-section">
              <h2>Experience</h2>
              {cv.experience.map((exp) => (
                <div key={exp.title} className="cv-entry">
                  <div className="cv-entry-head">
                    <strong>{exp.title}</strong>
                    {exp.period && <em>{exp.period}</em>}
                  </div>
                  <p>{exp.summary}</p>
                </div>
              ))}
            </section>

            {cv.selectedProjects && cv.selectedProjects.length > 0 && (
              <section className="cv-section">
                <h2>Selected projects</h2>
                {cv.selectedProjects.map((p) => (
                  <div key={p.name} className="cv-project-row">
                    <span>
                      <strong>{p.name}</strong>
                      <span style={{ color: "#4a6b78", fontWeight: 400 }}>
                        {" "}
                        — {p.role}
                      </span>
                    </span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer">
                        View ↗
                      </a>
                    )}
                  </div>
                ))}
              </section>
            )}

            <section className="cv-section">
              <h2>Education</h2>
              {cv.education.map((edu) => (
                <div key={edu.school} className="cv-entry">
                  <div className="cv-entry-head">
                    <strong>{edu.school}</strong>
                  </div>
                  {edu.detail && <p>{edu.detail}</p>}
                </div>
              ))}
            </section>

            {cv.interviews && cv.interviews.length > 0 && (
              <section className="cv-section">
                <h2>Media & Interviews</h2>
                {cv.interviews.map((interview) => (
                  <div key={interview.title} className="cv-project-row">
                    <span>
                      <strong>{interview.title}</strong>
                    </span>
                    <a href={interview.url} target="_blank" rel="noreferrer">
                      View ↗
                    </a>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>

        <p className="cv-footer-note">
          Born {birthday} · CV updated {cv.lastUpdated || "2026"} · {fileName}
        </p>
      </article>
    </div>
  );
}
