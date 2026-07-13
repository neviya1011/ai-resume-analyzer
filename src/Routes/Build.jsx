import React, { useEffect, useRef, useState } from "react";

const defaultData = {
  name: "",
  phone: "",
  email: "",
  leetcode: "",
  linkedin: "",
  github: "",
  portfolio: "",
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  skills: [],
};

const emptyItems = {
  education: {
    institution: "",
    degree: "",
    date: "",
    location: "",
    coursework: "",
  },
  experience: {
    company: "",
    role: "",
    date: "",
    location: "",
    bullets: [],
  },
  projects: {
    name: "",
    date: "",
    links: [],
    bullets: [],
  },
  certifications: {
    title: "",
    issuer: "",
    date: "",
  },
  achievements: {
    lead: "",
    description: "",
  },
  skills: {
    category: "",
    values: "",
  },
};

const getEmptyItem = (section) =>
  JSON.parse(JSON.stringify(emptyItems[section]));

const Build = () => {
  const pagesRef = useRef(null);

  const [data, setData] = useState(defaultData);

  const [active, setActive] = useState({
    education: 0,
    experience: 0,
    projects: 0,
    certifications: 0,
    achievements: 0,
    skills: 0,
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    localStorage.removeItem("latexResumeData");
  }, []);

  useEffect(() => {
    const pagesEl = pagesRef.current;
    if (!pagesEl) return;

    const recalcPages = () => {
      const pageWidth = pagesEl.clientWidth;
      if (pageWidth > 0) {
        const count = Math.max(
          1,
          Math.round(pagesEl.scrollWidth / pageWidth)
        );
        setTotalPages(count);
      }
    };

    const handleScroll = () => {
      const pageWidth = pagesEl.clientWidth;
      if (pageWidth > 0) {
        setPage(Math.round(pagesEl.scrollLeft / pageWidth));
      }
    };

    recalcPages();
    handleScroll();

    pagesEl.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", recalcPages);

    const resizeObserver = new ResizeObserver(recalcPages);
    resizeObserver.observe(pagesEl);

    return () => {
      pagesEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", recalcPages);
      resizeObserver.disconnect();
    };
    
  }, [data]);

  const scrollPage = (direction) => {
    const el = pagesRef.current;
    if (!el) return;

    const pageWidth = el.clientWidth;
    if (!pageWidth) return;

    const nextPage = Math.min(Math.max(page + direction, 0), totalPages - 1);

    el.scrollTo({
      left: nextPage * pageWidth,
      behavior: "smooth",
    });
  };

  const updateMain = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const addEntry = (section) => {
    const newList = [...data[section], getEmptyItem(section)];
    setData({ ...data, [section]: newList });
    setActive({ ...active, [section]: newList.length - 1 });
  };

  const removeEntry = (section) => {
    const index = active[section];
    const newList = data[section].filter((_, i) => i !== index);
    const newIndex = Math.max(0, index - 1);

    setData({ ...data, [section]: newList });
    setActive({ ...active, [section]: newIndex });
  };

  const clearEntry = (section) => {
    const index = active[section];
    if (index < 0 || index >= data[section].length) return;

    const updated = [...data[section]];
    updated[index] = getEmptyItem(section);

    setData({ ...data, [section]: updated });
  };

  const updateEntry = (section, field, value) => {
    const index = active[section];
    const updated = [...data[section]];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setData({ ...data, [section]: updated });
  };

  const moveEntry = (section, direction) => {
    const index = active[section];
    const newIndex = index + direction;
    const list = [...data[section]];

    if (newIndex < 0 || newIndex >= list.length) return;

    [list[index], list[newIndex]] = [list[newIndex], list[index]];

    setData({ ...data, [section]: list });
    setActive({ ...active, [section]: newIndex });
  };

  const goPrev = (section) => {
    setActive({
      ...active,
      [section]: Math.max(0, active[section] - 1),
    });
  };

  const goNext = (section) => {
    setActive({
      ...active,
      [section]: Math.min(data[section].length - 1, active[section] + 1),
    });
  };

  const addBullet = (section) => {
    const index = active[section];
    const updated = [...data[section]];

    updated[index].bullets.push("");

    setData({ ...data, [section]: updated });
  };

  const updateBullet = (section, bulletIndex, value) => {
    const index = active[section];
    const updated = [...data[section]];

    updated[index].bullets[bulletIndex] = value;

    setData({ ...data, [section]: updated });
  };

  const removeBullet = (section, bulletIndex) => {
    const index = active[section];
    const updated = [...data[section]];

    updated[index].bullets = updated[index].bullets.filter(
      (_, i) => i !== bulletIndex
    );

    setData({ ...data, [section]: updated });
  };

  const addProjectLink = () => {
    const index = active.projects;
    const updated = [...data.projects];

    updated[index].links.push({ label: "", url: "" });

    setData({ ...data, projects: updated });
  };

  const updateProjectLink = (linkIndex, field, value) => {
    const index = active.projects;
    const updated = [...data.projects];

    updated[index].links[linkIndex][field] = value;

    setData({ ...data, projects: updated });
  };

  const formatText = (text = "") => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      return <span key={index}>{part}</span>;
    });
  };

  const hasSection = (section) => {
    return data[section].some((item) =>
      Object.values(item).some((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return String(value).trim() !== "";
      })
    );
  };

  const isPrevDisabled = page <= 0;
  const isNextDisabled = page >= totalPages - 1;

  return (
    <div className="app-shell builder fixed inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-y-auto">
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }

          .smallBtn {
            background: rgb(147, 51, 234);
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
          }

          .smallBtn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          /* --- Responsive scale for the A4 preview ---
             The resume preview is a physical 210mm x 297mm document that
             gets scaled down to fit the screen. Instead of hardcoding one
             scale factor, it's driven by a CSS variable so it can shrink
             further on small viewports without touching the print rules
             (which reset transform/scale entirely anyway). */
          .resume-column {
            --scale: 0.62;
          }

          @media (max-width: 1023px) {
            .resume-column {
              --scale: 0.58;
            }
          }

          @media (max-width: 767px) {
            .resume-column {
              --scale: 0.5;
            }
          }

          @media (max-width: 639px) {
            .resume-column {
              --scale: 0.44;
            }
          }

          @media (max-width: 479px) {
            .resume-column {
              --scale: 0.36;
            }
          }

          @media (max-width: 359px) {
            .resume-column {
              --scale: 0.32;
            }
          }

          .resume-frame {
            width: calc(210mm * var(--scale));
            height: calc(297mm * var(--scale));
            overflow: hidden;
            background: white;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
            max-width: 100%;
          }

          .resume-pages {
            width: 210mm;
            height: 297mm;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-behavior: smooth;
            scrollbar-width: none;
            transform: scale(var(--scale));
            transform-origin: top left;
          }

          .resume-pages::-webkit-scrollbar {
            display: none;
          }

          /* SCREEN ONLY: multi-column layout is what drives the horizontal
             "virtual pages" you scroll through with Prev/Next. This is
             intentionally column-based on screen — it's fine there because
             nothing needs to map 1:1 onto physical printed page boxes; it's
             just a UI paging affordance. This gets fully neutralized in
             @media print below, where a different (native) pagination
             mechanism takes over. */
          .resume-preview {
            width: 210mm;
            min-height: 297mm;
            height: 297mm;
            background: white;
            column-width: 210mm;
            column-gap: 0;
            column-fill: auto;
            box-sizing: border-box;
            padding: 0;
           }

          .resume-page-inset {
            padding: 16mm;
            box-sizing: border-box;
            -webkit-box-decoration-break: clone;
            box-decoration-break: clone;
          }

          /* --- Text wrapping: nothing should ever spill past the page edge --- */
          .resume-preview,
          .resume-preview * {
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          .resume-preview img {
            max-width: 100%;
          }

          /* --- Break rules ---
             break-inside/break-after with the "-column" suffix govern the
             on-screen column view. The plain legacy page-break-* properties
             alongside them are what actually govern *print* pagination —
             they are a separate fragmentation context from columns, which
             is exactly why print needs its own rules rather than reusing
             the column ones. */
          .resume-section {
            break-inside: auto;
          }

          .resume-section-heading {
            break-after: avoid-column;
            page-break-after: avoid;
          }

          .resume-entry,
          .resume-section li,
          .resume-section > p {
            break-inside: avoid-column;
            page-break-inside: avoid;
          }

          @media print {
            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
              overflow: visible;
            }

            body * {
              visibility: hidden;
            }

            .resume-preview,
            .resume-preview * {
              visibility: visible;
            }

            .resume-frame {
              width: auto !important;
              height: auto !important;
              overflow: visible !important;
              box-shadow: none !important;
            }

            .resume-pages {
              transform: none !important;
              overflow: visible !important;
              width: auto !important;
              height: auto !important;
            }

            /* A position:fixed (or absolute) ANCESTOR caps the whole subtree
               at one viewport-sized printable box in Chrome's print engine —
               no matter how .resume-preview itself is styled, content can't
               fragment across multiple physical pages while it's nested
               inside one of these. .app-shell (position: fixed; inset: 0)
               and the grid/flex wrappers around it are exactly that, and
               they were never reset for print before now. Flattening them
               to normal static block flow is what actually lets pagination
               happen — everything below (.resume-preview's column reset,
               the @page size, the break-inside rules) only works once this
               is in place. */
            .app-shell {
              position: static !important;
              inset: auto !important;
              overflow: visible !important;
              height: auto !important;
              width: auto !important;
              background: none !important;
            }

            .resume-layout {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              gap: 0 !important;
            }

            .resume-column {
              display: block !important;
              margin: 0 auto !important;
              gap: 0 !important;
            }

            /* THE COLUMNS FIX: turn the multi-column "virtual pages" box back
               into a single, ordinary flowing block for print. Multi-column
               layout lays content out horizontally, and that horizontal
               overflow is what was disappearing — a fixed height on this
               element was never what hid page 2+, it's what created the
               column breaks in the first place. column-count/column-width
               here are reset so there is exactly one column, at which point
               normal print pagination (driven by @page size + the
               page-break-inside/page-break-after rules above) can do what
               it's actually good at: splitting tall content across as many
               210mm x 297mm physical pages as it needs. Width stays 210mm
               so each printed page still matches the @page box exactly.
               position is now static (not absolute) — with .app-shell no
               longer fixed, .resume-preview doesn't need manual
               repositioning; it just flows normally after everything else
               on the page has been display:none'd or visibility:hidden'd. */
            .resume-preview {
              position: static;
              width: 210mm;
              margin: 0 auto;
              height: auto !important;
              min-height: 0 !important;
              column-width: auto !important;
              column-count: 1 !important;
              column-gap: normal !important;
              overflow: visible !important;
              box-shadow: none !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="relative flex items-center justify-center px-4 sm:px-6 pt-6 mb-8 no-print">

        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold">
          Build Your Own Resume
        </h1>
      </div>

      <div className="resume-layout grid grid-cols-1 xl:grid-cols-2 gap-6 px-4 sm:px-6 pb-6 justify-items-center items-start min-h-0 mt-10 sm:mt-15">
        <div className="builder no-print w-full max-w-[720px] h-[70vh] xl:h-[calc(100vh-45px)] overflow-y-auto bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
            Resume Builder
          </h1>

          <FormTitle title="Header" />

          <Input label="Full Name" value={data.name} onChange={(v) => updateMain("name", v)} />
          <Input label="Phone" value={data.phone} onChange={(v) => updateMain("phone", v)} />
          <Input label="Email" value={data.email} onChange={(v) => updateMain("email", v)} />
          <Input label="LeetCode" value={data.leetcode} onChange={(v) => updateMain("leetcode", v)} />
          <Input label="LinkedIn" value={data.linkedin} onChange={(v) => updateMain("linkedin", v)} />
          <Input label="GitHub" value={data.github} onChange={(v) => updateMain("github", v)} />
          <Input label="Portfolio" value={data.portfolio} onChange={(v) => updateMain("portfolio", v)} />

          <Carousel title="Education" section="education" data={data} active={active} addEntry={addEntry} removeEntry={removeEntry} clearEntry={clearEntry} goPrev={goPrev} goNext={goNext} moveEntry={moveEntry}>
            {data.education.length > 0 && (
              <>
                <Input label="Institution" value={data.education[active.education].institution} onChange={(v) => updateEntry("education", "institution", v)} />
                <Input label="Degree / Field" value={data.education[active.education].degree} onChange={(v) => updateEntry("education", "degree", v)} />
                <Input label="Date Range" value={data.education[active.education].date} onChange={(v) => updateEntry("education", "date", v)} />
                <Input label="Location / CGPA" value={data.education[active.education].location} onChange={(v) => updateEntry("education", "location", v)} />
                <Input label="Coursework" value={data.education[active.education].coursework} onChange={(v) => updateEntry("education", "coursework", v)} />
              </>
            )}
          </Carousel>

          <Carousel title="Experience" section="experience" data={data} active={active} addEntry={addEntry} removeEntry={removeEntry} clearEntry={clearEntry} goPrev={goPrev} goNext={goNext} moveEntry={moveEntry}>
            {data.experience.length > 0 && (
              <>
                <Input label="Company" value={data.experience[active.experience].company} onChange={(v) => updateEntry("experience", "company", v)} />
                <Input label="Role" value={data.experience[active.experience].role} onChange={(v) => updateEntry("experience", "role", v)} />
                <Input label="Date Range" value={data.experience[active.experience].date} onChange={(v) => updateEntry("experience", "date", v)} />
                <Input label="Location" value={data.experience[active.experience].location} onChange={(v) => updateEntry("experience", "location", v)} />

                <BulletForm
                  bullets={data.experience[active.experience].bullets}
                  onAdd={() => addBullet("experience")}
                  onChange={(i, v) => updateBullet("experience", i, v)}
                  onRemove={(i) => removeBullet("experience", i)}
                />
              </>
            )}
          </Carousel>

          <Carousel title="Projects" section="projects" data={data} active={active} addEntry={addEntry} removeEntry={removeEntry} clearEntry={clearEntry} goPrev={goPrev} goNext={goNext} moveEntry={moveEntry}>
            {data.projects.length > 0 && (
              <>
                <Input label="Project Name" value={data.projects[active.projects].name} onChange={(v) => updateEntry("projects", "name", v)} />
                <Input label="Date / Tech Stack" value={data.projects[active.projects].date} onChange={(v) => updateEntry("projects", "date", v)} />

                <button onClick={addProjectLink} className="smallBtn mb-3">
                  Add Project Link
                </button>

                {data.projects[active.projects].links.map((link, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <Input label="Label" value={link.label} onChange={(v) => updateProjectLink(i, "label", v)} />
                    <Input label="URL" value={link.url} onChange={(v) => updateProjectLink(i, "url", v)} />
                  </div>
                ))}

                <BulletForm
                  bullets={data.projects[active.projects].bullets}
                  onAdd={() => addBullet("projects")}
                  onChange={(i, v) => updateBullet("projects", i, v)}
                  onRemove={(i) => removeBullet("projects", i)}
                />
              </>
            )}
          </Carousel>

          <Carousel title="Certifications" section="certifications" data={data} active={active} addEntry={addEntry} removeEntry={removeEntry} clearEntry={clearEntry} goPrev={goPrev} goNext={goNext} moveEntry={moveEntry}>
            {data.certifications.length > 0 && (
              <>
                <Input label="Title" value={data.certifications[active.certifications].title} onChange={(v) => updateEntry("certifications", "title", v)} />
                <Input label="Issuer" value={data.certifications[active.certifications].issuer} onChange={(v) => updateEntry("certifications", "issuer", v)} />
                <Input label="Date Range" value={data.certifications[active.certifications].date} onChange={(v) => updateEntry("certifications", "date", v)} />
              </>
            )}
          </Carousel>

          <Carousel title="Achievements" section="achievements" data={data} active={active} addEntry={addEntry} removeEntry={removeEntry} clearEntry={clearEntry} goPrev={goPrev} goNext={goNext} moveEntry={moveEntry}>
            {data.achievements.length > 0 && (
              <>
                <Input label="Bold Lead-in" value={data.achievements[active.achievements].lead} onChange={(v) => updateEntry("achievements", "lead", v)} />
                <Input label="Description" value={data.achievements[active.achievements].description} onChange={(v) => updateEntry("achievements", "description", v)} />
              </>
            )}
          </Carousel>

          <Carousel title="Skills" section="skills" data={data} active={active} addEntry={addEntry} removeEntry={removeEntry} clearEntry={clearEntry} goPrev={goPrev} goNext={goNext} moveEntry={moveEntry}>
            {data.skills.length > 0 && (
              <>
                <Input label="Category Label" value={data.skills[active.skills].category} onChange={(v) => updateEntry("skills", "category", v)} />
                <Input label="Comma-separated Values" value={data.skills[active.skills].values} onChange={(v) => updateEntry("skills", "values", v)} />
              </>
            )}
          </Carousel>

          <button
            onClick={() => window.print()}
            className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl font-bold"
          >
            Print / Save as PDF
          </button>
        </div>

        <div className="resume-column flex flex-col items-center gap-3 w-full">
          <div className="resume-frame">
            <div ref={pagesRef} className="resume-pages">
              <div
                className="resume-preview text-[11px] leading-[1.25] text-black"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                <div className="resume-page-inset">
                <ResumeHeader data={data} />

                <div className="text-[12px] leading-[1.3]">
                  {hasSection("education") && (
                    <PreviewSection title="Education">
                      {data.education.map((edu, i) => (
                        <PreviewEntry key={i} left={edu.institution} right={edu.date} subLeft={edu.degree} subRight={edu.location}>
                          {edu.coursework && (
                            <p>
                              <strong>Coursework:</strong> {formatText(edu.coursework)}
                            </p>
                          )}
                        </PreviewEntry>
                      ))}
                    </PreviewSection>
                  )}

                  {hasSection("experience") && (
                    <PreviewSection title="Experience">
                      {data.experience.map((exp, i) => (
                        <PreviewEntry key={i} left={exp.company} right={exp.date} subLeft={exp.role} subRight={exp.location}>
                          <Bullets bullets={exp.bullets} formatText={formatText} />
                        </PreviewEntry>
                      ))}
                    </PreviewSection>
                  )}

                  {hasSection("projects") && (
                    <PreviewSection title="Projects">
                      {data.projects.map((project, i) => (
                        <PreviewEntry
                          key={i}
                          left={
                            <>
                              {project.name}
                              {project.links.map((link, index) => (
                                <a key={index} href={link.url} className="text-blue-700 ml-2 break-words">
                                  {link.label}
                                </a>
                              ))}
                            </>
                          }
                          right={project.date}
                        >
                          <Bullets bullets={project.bullets} formatText={formatText} />
                        </PreviewEntry>
                      ))}
                    </PreviewSection>
                  )}

                  {hasSection("certifications") && (
                    <PreviewSection title="Certifications">
                      {data.certifications.map((cert, i) => (
                        <PreviewEntry key={i} left={cert.title} right={cert.date} subLeft={cert.issuer} />
                      ))}
                    </PreviewSection>
                  )}

                  {hasSection("achievements") && (
                    <PreviewSection title="Achievements and Extra-Curricular Activities">
                      <ul className="list-disc ml-5 text-justify">
                        {data.achievements.map((ach, i) => (
                          <li key={i} className="break-words">
                            {ach.lead && <strong>{ach.lead}: </strong>}
                            {formatText(ach.description)}
                          </li>
                        ))}
                      </ul>
                    </PreviewSection>
                  )}

                  {hasSection("skills") && (
                    <PreviewSection title="Skills">
                      {data.skills.map((skill, i) => (
                        <p key={i} className="break-words">
                          <strong>{skill.category}:</strong> {skill.values}
                        </p>
                      ))}
                    </PreviewSection>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-3 no-print">
            <button
              onClick={() => scrollPage(-1)}
              className="smallBtn"
              disabled={isPrevDisabled}
            >
              Prev Page
            </button>

            <span className="text-xs font-semibold text-gray-500">
              Page {Math.min(page + 1, totalPages)} / {totalPages}
            </span>

            <button
              onClick={() => scrollPage(1)}
              className="smallBtn"
              disabled={isNextDisabled}
            >
              Next Page
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const FormTitle = ({ title }) => (
  <h2 className="font-bold text-xl border-b pb-2 mb-4 mt-6">{title}</h2>
);

const Input = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 outline-none focus:border-purple-500"
    />
  </div>
);

const Carousel = ({
  title,
  section,
  data,
  active,
  addEntry,
  removeEntry,
  clearEntry,
  goPrev,
  goNext,
  moveEntry,
  children,
}) => {
  const total = data[section].length;
  const current = active[section] + 1;

  return (
    <div className="mt-8 border-t pt-5">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h2 className="font-bold text-xl">{title}</h2>

        <button onClick={() => addEntry(section)} className="smallBtn">
          + Add
        </button>
      </div>

      {total === 0 ? (
        <div className="border rounded-xl p-5 bg-gray-50 text-gray-500">
          No {title} added yet.
        </div>
      ) : (
        <div className="border rounded-xl p-3 sm:p-5 bg-gray-50">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => goPrev(section)} className="smallBtn">
                Prev
              </button>

              <button onClick={() => clearEntry(section)} className="smallBtn bg-red-500">
                Clear
              </button>
            </div>

            <p className="font-semibold text-sm">
              {title} {current} / {total}
            </p>

            <button onClick={() => goNext(section)} className="smallBtn">
              Next
            </button>
          </div>

          <div className="flex gap-2 flex-wrap justify-end mb-4">
            <button onClick={() => moveEntry(section, -1)} className="smallBtn">
              Move Up
            </button>
            <button onClick={() => moveEntry(section, 1)} className="smallBtn">
              Move Down
            </button>
            <button onClick={() => removeEntry(section)} className="smallBtn bg-red-500">
              Remove
            </button>
          </div>

          {children}
        </div>
      )}
    </div>
  );
};

const BulletForm = ({ bullets, onAdd, onChange, onRemove }) => (
  <div className="mt-4">
    <button onClick={onAdd} className="smallBtn mb-3">
      Add Bullet
    </button>

    {bullets.map((bullet, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          value={bullet}
          onChange={(e) => onChange(i, e.target.value)}
          placeholder="Use **bold** text"
          className="w-full border rounded-lg px-3 py-2 outline-none focus:border-purple-500"
        />

        <button onClick={() => onRemove(i)} className="smallBtn bg-red-500 shrink-0">
          Remove
        </button>
      </div>
    ))}
  </div>
);

const ResumeHeader = ({ data }) => {
  const links = [
    data.phone,
    data.email,
    data.leetcode && `LeetCode: ${data.leetcode}`,
    data.linkedin && `LinkedIn: ${data.linkedin}`,
    data.github && `GitHub: ${data.github}`,
    data.portfolio && `Portfolio: ${data.portfolio}`,
  ].filter(Boolean);

  return (
    <div className="text-center pb-2 mb-4">
      <h1 className="text-2xl font-bold uppercase tracking-wide break-words">
        {data.name || "Your Name"}
      </h1>

      <p className="text-[12px] text-blue-700 mt-1 break-words">
        {links.join(" | ")}
      </p>
    </div>
  );
};

const PreviewSection = ({ title, children }) => (
  <section className="resume-section mb-4">
    <h2 className="resume-section-heading font-bold uppercase border-b border-black mb-2">
      {title}
    </h2>
    {children}
  </section>
);

const PreviewEntry = ({ left, right, subLeft, subRight, children }) => (
  <div className="resume-entry mb-3">
    <div className="flex justify-between gap-4">
      <strong className="min-w-0 break-words">{left}</strong>
      <em className="min-w-0 shrink-0 break-words">{right}</em>
    </div>

    {(subLeft || subRight) && (
      <div className="flex justify-between gap-4">
        <em className="min-w-0 break-words">{subLeft}</em>
        <em className="min-w-0 shrink-0 break-words">{subRight}</em>
      </div>
    )}

    <div className="mt-1 text-justify break-words">{children}</div>
  </div>
);

const Bullets = ({ bullets, formatText }) => (
  <ul className="list-disc ml-5 text-justify">
    {bullets.filter(Boolean).map((bullet, i) => (
      <li key={i} className="break-words">{formatText(bullet)}</li>
    ))}
  </ul>
);

export default Build;