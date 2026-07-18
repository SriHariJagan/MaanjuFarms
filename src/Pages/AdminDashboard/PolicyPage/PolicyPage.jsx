import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FileText, Plus, Eye, Send, Archive, X, CheckCircle, AlertTriangle,
  Clock, Hash, CalendarDays, RefreshCw, ChevronDown, ChevronUp, Loader2,
  BookMarked, RotateCcw, ExternalLink, Edit3, Save,
  Bold, Italic, List, Heading1, Link2, Trash2, PlusCircle
} from "lucide-react";
import styles from "./PolicyPage.module.css";
import { ADMIN_POLICY_API } from "../../../urls";
import { useAuth } from "../../../Store/useContext";
import { MarkdownBlock } from "../../../utils/renderMarkdown";

const STATUS_BADGE = {
  DRAFT: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
  PUBLISHED: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
  ARCHIVED: { bg: "rgba(107,114,128,0.1)", color: "#6b7280" },
};

const PolicyPage = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", metaDescription: "", sections: [] });
  const [viewOnly, setViewOnly] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", metaDescription: "" });
  const previewContainerRef = useRef(null);
  const previewSectionRefs = useRef({});

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(ADMIN_POLICY_API, { headers });
      if (data.success) setPolicies(data.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load policies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleAction = async (action, id) => {
    try {
      setActionLoading(`${action}-${id}`);
      const endpoints = {
        publish: `${ADMIN_POLICY_API}/${id}/publish`,
        unpublish: `${ADMIN_POLICY_API}/${id}/unpublish`,
        archive: `${ADMIN_POLICY_API}/${id}/archive`,
        unarchive: `${ADMIN_POLICY_API}/${id}/unarchive`,
        delete: `${ADMIN_POLICY_API}/${id}`,
      };
      const { data } = action === "delete"
        ? await axios.delete(endpoints[action], { headers })
        : await axios.post(endpoints[action], {}, { headers });
      if (data.success) {
        if (action === "delete") {
          setPolicies((prev) => prev.filter((p) => p._id !== id));
          if (selected?._id === id) setSelected(null);
        } else {
          setPolicies((prev) => prev.map((p) => (p._id === id ? data.data : p)));
          if (selected?._id === id) setSelected(data.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.msg || `Failed to ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  const loadVersions = async (id) => {
    try {
      setShowVersions(true);
      const { data } = await axios.get(`${ADMIN_POLICY_API}/${id}/versions`, { headers });
      if (data.success) setVersions(data.data);
    } catch (err) {
      alert("Failed to load versions");
    }
  };

  const viewPolicy = async (id) => {
    try {
      const { data } = await axios.get(`${ADMIN_POLICY_API}/${id}`, { headers });
      if (data.success) {
        setEditing(data.data._id);
        setViewOnly(true);
        setActiveSectionIdx(0);
        setEditForm({
          title: data.data.title || "",
          metaDescription: data.data.metaDescription || "",
          sections: (data.data.sections || []).map((s) => ({ ...s })),
        });
      }
    } catch (err) {
      alert("Failed to load policy details");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openEditor = (policy) => {
    setEditing(policy._id);
    setViewOnly(false);
    setActiveSectionIdx(0);
    setEditForm({
      title: policy.title || "",
      metaDescription: policy.metaDescription || "",
      sections: (policy.sections || []).map((s) => ({ ...s })),
    });
  };

  const closeEditor = () => {
    setEditing(null);
    setViewOnly(false);
    setEditForm({ title: "", metaDescription: "", sections: [] });
    setActiveSectionIdx(0);
  };

  // Scroll preview to the active section and highlight it
  useEffect(() => {
    if (!editing || viewOnly) return;
    const sectionId = editForm.sections[activeSectionIdx]?.id;
    if (!sectionId) return;
    const el = previewSectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSectionIdx, editing, viewOnly]);

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    setEditForm((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    const newId = `section-${Date.now()}`;
    setEditForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { id: newId, title: "New Section", content: "", order: prev.sections.length + 1 }],
    }));
    setActiveSectionIdx(editForm.sections.length);
  };

  const deleteSection = (index) => {
    setEditForm((prev) => {
      const sections = prev.sections.filter((_, i) => i !== index);
      return { ...prev, sections };
    });
    if (activeSectionIdx >= index) {
      setActiveSectionIdx(Math.max(0, activeSectionIdx - 1));
    }
  };

  const insertFormat = (index, syntax) => {
    const textarea = document.getElementById(`section-textarea-${index}`);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editForm.sections[index].content.substring(start, end);
    const insert = syntax.replace("$1", selected || "text");
    const newContent =
      editForm.sections[index].content.substring(0, start) +
      insert +
      editForm.sections[index].content.substring(end);
    handleSectionChange(index, "content", newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insert.length, start + insert.length);
    }, 0);
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

  const handleCreate = async () => {
    const title = createForm.title.trim();
    if (!title) return alert("Title is required");
    const slug = slugify(title);
    if (!slug) return alert("Could not generate a valid slug from the title");
    try {
      setActionLoading("create");
      const { data } = await axios.post(
        ADMIN_POLICY_API,
        { title, slug, metaDescription: createForm.metaDescription.trim() },
        { headers }
      );
      if (data.success) {
        setPolicies((prev) => [data.data, ...prev]);
        setShowCreate(false);
        setCreateForm({ title: "", metaDescription: "" });
        openEditor(data.data);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create policy");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSave = async (id) => {
    try {
      setActionLoading(`save-${id}`);
      const payload = {
        title: editForm.title,
        metaDescription: editForm.metaDescription,
        sections: editForm.sections.map((s, i) => ({
          id: s.id,
          title: s.title,
          content: s.content,
          order: i + 1,
        })),
      };
      const { data } = await axios.put(`${ADMIN_POLICY_API}/${id}`, payload, { headers });
      if (data.success) {
        setPolicies((prev) => prev.map((p) => (p._id === id ? data.data : p)));
        if (selected?._id === id) setSelected(data.data);
        closeEditor();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to save policy");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className={styles.title}>Policy Management</h1>
          <p className={styles.subtitle}>Create, edit, publish, and manage legal policies.</p>
        </div>
        <div className={styles.headerActions}>
          <motion.button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`} onClick={() => setShowCreate(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Plus size={16} />
            <span>New Policy</span>
          </motion.button>
          <motion.button className={styles.headerBtn} onClick={fetchPolicies} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <div className={styles.errorBox}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skelCard}>
              <div className={styles.skelLine} style={{ width: "70%", height: 20 }} />
              <div className={styles.skelLine} style={{ width: "40%", height: 14, marginTop: 8 }} />
              <div className={styles.skelLine} style={{ width: "100%", height: 14, marginTop: 12 }} />
            </div>
          ))}
        </div>
      ) : policies.length === 0 ? (
        <div className={styles.emptyState}>
          <FileText size={48} />
          <h3>No policies found</h3>
          <p>Policies will appear here once created. Run the seed script or use the API to create them.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {policies.map((policy) => {
            const isExpanded = expandedId === policy._id;
            const badge = STATUS_BADGE[policy.status] || STATUS_BADGE.DRAFT;

            return (
              <motion.div
                key={policy._id}
                className={`${styles.card} ${selected?._id === policy._id ? styles.cardSelected : ""}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardIcon}>
                      <FileText size={22} />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitleRow}>
                        <h3 className={styles.cardTitle}>{policy.title}</h3>
                        <span className={styles.statusBadge} style={{ background: badge.bg, color: badge.color }}>
                          {policy.status}
                        </span>
                      </div>
                      <div className={styles.cardMeta}>
                        <span><Hash size={12} /> v{policy.version}</span>
                        <span><CalendarDays size={12} /> {new Date(policy.updatedAt).toLocaleDateString("en-IN")}</span>
                        <span className={styles.slug}>{policy.slug}</span>
                      </div>
                    </div>
                  </div>
                  <button className={styles.expandBtn} onClick={() => toggleExpand(policy._id)}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className={styles.cardBody}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={styles.cardDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Sections</span>
                          <span className={styles.detailValue}>{policy.sections?.length || 0}</span>
                        </div>
                        {policy.publishedAt && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Published</span>
                            <span className={styles.detailValue}>{new Date(policy.publishedAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.actionBtn} onClick={() => viewPolicy(policy._id)} title="View details">
                          <Eye size={15} /> View
                        </button>

                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditor(policy)}
                          title="Edit content"
                        >
                          <Edit3 size={15} /> Edit
                        </button>

                        {policy.status === "DRAFT" && (
                          <button
                            className={`${styles.actionBtn} ${styles.actionPublish}`}
                            onClick={() => handleAction("publish", policy._id)}
                            disabled={actionLoading === `publish-${policy._id}`}
                          >
                            {actionLoading === `publish-${policy._id}` ? <Loader2 size={15} /> : <Send size={15} />}
                            Publish
                          </button>
                        )}

                        {policy.status === "PUBLISHED" && (
                          <>
                            <button
                              className={`${styles.actionBtn} ${styles.actionUnpublish}`}
                              onClick={() => handleAction("unpublish", policy._id)}
                              disabled={actionLoading === `unpublish-${policy._id}`}
                            >
                              {actionLoading === `unpublish-${policy._id}` ? <Loader2 size={15} /> : <RotateCcw size={15} />}
                              Unpublish
                            </button>
                            <a
                              href={`/${policy.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.actionBtn}
                              title="View live page"
                            >
                              <ExternalLink size={15} /> Live
                            </a>
                          </>
                        )}

                        {policy.status === "ARCHIVED" ? (
                          <>
                            <button
                              className={`${styles.actionBtn} ${styles.actionPublish}`}
                              onClick={() => handleAction("unarchive", policy._id)}
                              disabled={actionLoading === `unarchive-${policy._id}`}
                            >
                              {actionLoading === `unarchive-${policy._id}` ? <Loader2 size={15} /> : <RotateCcw size={15} />}
                              Unarchive
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionPublish}`}
                              onClick={() => handleAction("publish", policy._id)}
                              disabled={actionLoading === `publish-${policy._id}`}
                            >
                              {actionLoading === `publish-${policy._id}` ? <Loader2 size={15} /> : <Send size={15} />}
                              Publish
                            </button>
                          </>
                        ) : (
                          <button
                            className={`${styles.actionBtn} ${styles.actionArchive}`}
                            onClick={() => handleAction("archive", policy._id)}
                            disabled={actionLoading === `archive-${policy._id}`}
                          >
                            {actionLoading === `archive-${policy._id}` ? <Loader2 size={15} /> : <Archive size={15} />}
                            Archive
                          </button>
                        )}

                        <button className={styles.actionBtn} onClick={() => { loadVersions(policy._id); setSelected(policy); }}>
                          <Clock size={15} /> History
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionDelete}`}
                          onClick={() => {
                            if (window.confirm(`Permanently delete "${policy.title}"? This cannot be undone.`)) {
                              handleAction("delete", policy._id);
                            }
                          }}
                          disabled={actionLoading === `delete-${policy._id}`}
                        >
                          {actionLoading === `delete-${policy._id}` ? <Loader2 size={15} /> : <Trash2 size={15} />}
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.drawerOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelected(null); setShowVersions(false); }}
          >
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHeader}>
                <div>
                  <button className={styles.drawerClose} onClick={() => { setSelected(null); setShowVersions(false); }}>
                    <X size={18} />
                  </button>
                  <h2 className={styles.drawerTitle}>{showVersions ? "Version History" : selected.title}</h2>
                  {!showVersions && (
                    <span className={styles.drawerSlug}>{selected.slug}</span>
                  )}
                </div>
                {!showVersions && (
                  <span className={styles.statusBadge} style={{ background: STATUS_BADGE[selected.status]?.bg, color: STATUS_BADGE[selected.status]?.color }}>
                    {selected.status}
                  </span>
                )}
              </div>

              <div className={styles.drawerBody}>
                {showVersions ? (
                  <div className={styles.versionList}>
                    {versions.map((v) => (
                      <div key={v._id} className={`${styles.versionItem} ${v._id === selected._id ? styles.versionCurrent : ""}`}>
                        <div className={styles.versionTop}>
                          <strong>Version {v.version}</strong>
                          <span className={styles.statusBadge} style={{ background: STATUS_BADGE[v.status]?.bg, color: STATUS_BADGE[v.status]?.color }}>
                            {v.status}
                          </span>
                        </div>
                        <div className={styles.versionMeta}>
                          <span>{new Date(v.updatedAt).toLocaleString("en-IN")}</span>
                        </div>
                        {v._id !== selected._id && (
                          <button
                            className={styles.versionViewBtn}
                            onClick={() => { setShowVersions(false); viewPolicy(v._id); }}
                          >
                            <Eye size={14} /> View this version
                          </button>
                        )}
                        {v._id === selected._id && (
                          <span className={styles.versionCurrentLabel}>Currently viewing</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <section className={styles.drawerSection}>
                      <h3>Metadata</h3>
                      <div className={styles.metaGrid}>
                        <div><label>Version</label><span>{selected.version}</span></div>
                        <div><label>Status</label><span>{selected.status}</span></div>
                        <div><label>Slug</label><span className={styles.mono}>{selected.slug}</span></div>
                        {selected.publishedAt && (
                          <div><label>Published At</label><span>{new Date(selected.publishedAt).toLocaleString("en-IN")}</span></div>
                        )}
                        {selected.effectiveFrom && (
                          <div><label>Effective From</label><span>{new Date(selected.effectiveFrom).toLocaleDateString("en-IN")}</span></div>
                        )}
                      </div>
                    </section>

                    <section className={styles.drawerSection}>
                      <h3>Sections ({selected.sections?.length || 0})</h3>
                      <div className={styles.sectionList}>
                        {selected.sections
                          ?.sort((a, b) => a.order - b.order)
                          .map((sec) => (
                            <div key={sec.id} className={styles.sectionItem}>
                              <div className={styles.sectionItemHeader}>
                                <span className={styles.sectionOrder}>#{sec.order}</span>
                                <strong>{sec.title}</strong>
                                {sec.isVisible === false && <span className={styles.hiddenTag}>Hidden</span>}
                              </div>
                              <p className={styles.sectionPreview}>
                                {sec.content?.slice(0, 200)}
                                {(sec.content?.length || 0) > 200 ? "..." : ""}
                              </p>
                            </div>
                          ))}
                      </div>
                    </section>

                    {selected.metaDescription && (
                      <section className={styles.drawerSection}>
                        <h3>Meta Description</h3>
                        <p className={styles.metaDesc}>{selected.metaDescription}</p>
                      </section>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className={styles.drawerOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowCreate(false); setCreateForm({ title: "", metaDescription: "" }); }}
          >
            <motion.div
              className={styles.createModal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.createModalHeader}>
                <h2>New Policy</h2>
                <button className={styles.drawerClose} onClick={() => { setShowCreate(false); setCreateForm({ title: "", metaDescription: "" }); }}>
                  <X size={18} />
                </button>
              </div>
              <div className={styles.createModalBody}>
                <label className={styles.createLabel}>Title *</label>
                <input
                  className={styles.createInput}
                  value={createForm.title}
                  onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Refund Policy"
                  autoFocus
                />
                <p className={styles.createHint}>Slug will be: <strong>{slugify(createForm.title) || "..."}</strong></p>

                <label className={styles.createLabel}>Meta Description</label>
                <textarea
                  className={styles.createTextarea}
                  value={createForm.metaDescription}
                  onChange={(e) => setCreateForm((p) => ({ ...p, metaDescription: e.target.value }))}
                  placeholder="Brief description for search engines"
                  rows={3}
                />
              </div>
              <div className={styles.createModalFooter}>
                <button
                  className={styles.actionBtn}
                  onClick={() => { setShowCreate(false); setCreateForm({ title: "", metaDescription: "" }); }}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.actionPublish}`}
                  onClick={handleCreate}
                  disabled={actionLoading === "create" || !createForm.title.trim()}
                >
                  {actionLoading === "create" ? <Loader2 size={15} /> : <Plus size={15} />}
                  Create Policy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal — split editor / preview */}
      {editing && (
        <motion.div
          className={styles.editOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditor}
        >
          <motion.div
            className={styles.editSplit}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className={styles.editSplitHeader}>
              <div className={styles.editSplitHeaderLeft}>
                <button className={styles.drawerClose} onClick={closeEditor}>
                  <X size={18} />
                </button>
                <h2 className={styles.drawerTitle}>{viewOnly ? "Preview Policy" : "Edit Policy"}</h2>
              </div>
              {viewOnly ? (
                <button className={styles.actionBtn} onClick={() => setViewOnly(false)}>
                  <Edit3 size={15} /> Switch to Edit
                </button>
              ) : (
                <button
                  className={`${styles.actionBtn} ${styles.actionPublish}`}
                  onClick={() => handleSave(editing)}
                  disabled={actionLoading === `save-${editing}`}
                >
                  {actionLoading === `save-${editing}` ? <Loader2 size={15} /> : <Save size={15} />}
                  Save Changes
                </button>
              )}
            </div>

            {/* ── Split body ── */}
            <div className={viewOnly ? styles.editSplitBodySingle : styles.editSplitBody}>
              {!viewOnly && (
                <div className={styles.editSplitPane}>
                  <section className={styles.drawerSection}>
                    <h3>Title</h3>
                    <input
                      className={styles.editInput}
                      value={editForm.title}
                      onChange={(e) => handleEditChange("title", e.target.value)}
                      placeholder="Policy title"
                    />
                  </section>

                  <section className={styles.drawerSection}>
                    <h3>Meta Description</h3>
                    <textarea
                      className={styles.editTextarea}
                      value={editForm.metaDescription}
                      onChange={(e) => handleEditChange("metaDescription", e.target.value)}
                      placeholder="Brief description for search engines"
                      rows={3}
                    />
                  </section>

                  <section className={styles.drawerSection}>
                    <div className={styles.editSectionHeading}>
                      <h3>Sections ({editForm.sections.length})</h3>
                      <button className={styles.addSectionBtn} onClick={addSection}>
                        <PlusCircle size={15} /> Add Section
                      </button>
                    </div>
                    <div className={styles.editSectionList}>
                      {editForm.sections.map((sec, i) => {
                        const isOpen = activeSectionIdx === i;
                        return (
                          <div key={sec.id} className={`${styles.editSectionCard} ${isOpen ? styles.editSectionCardOpen : ""}`}>
                            <button
                              className={styles.editSectionHeader}
                              onClick={() => setActiveSectionIdx(isOpen ? -1 : i)}
                            >
                              <span className={styles.sectionOrder}>#{i + 1}</span>
                              <strong>{sec.title}</strong>
                              <span className={styles.editSectionChevron}>
                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </span>
                            </button>
                            {isOpen && (
                              <div className={styles.editSectionBody}>
                                <div className={styles.editSectionTitleRow}>
                                  <input
                                    className={styles.editSectionTitleInput}
                                    value={sec.title}
                                    onChange={(e) => handleSectionChange(i, "title", e.target.value)}
                                    placeholder="Section heading"
                                  />
                                  <button
                                    className={styles.deleteSectionBtn}
                                    onClick={() => deleteSection(i)}
                                    title="Delete section"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                                <div className={styles.editToolbar}>
                                  <button className={styles.toolbarBtn} onClick={() => insertFormat(i, "**$1**")} title="Bold">
                                    <Bold size={14} />
                                  </button>
                                  <button className={styles.toolbarBtn} onClick={() => insertFormat(i, "*$1*")} title="Italic">
                                    <Italic size={14} />
                                  </button>
                                  <button className={styles.toolbarBtn} onClick={() => insertFormat(i, "### $1")} title="Heading">
                                    <Heading1 size={14} />
                                  </button>
                                  <button className={styles.toolbarBtn} onClick={() => insertFormat(i, "\n- $1")} title="Bullet list">
                                    <List size={14} />
                                  </button>
                                  <button className={styles.toolbarBtn} onClick={() => insertFormat(i, "[$1](url)")} title="Link">
                                    <Link2 size={14} />
                                  </button>
                                </div>
                                <textarea
                                  id={`section-textarea-${i}`}
                                  className={styles.editSectionTextarea}
                                  value={sec.content}
                                  onChange={(e) => handleSectionChange(i, "content", e.target.value)}
                                  rows={10}
                                  placeholder="Write section content using markdown..."
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}

              <div className={styles.editSplitPane} ref={previewContainerRef}>
                <div className={styles.editPreviewContent}>
                  <h1 className={styles.editPreviewTitle}>{editForm.title}</h1>
                  {editForm.sections.map((sec, i) => (
                    <section
                      key={sec.id}
                      ref={(el) => { previewSectionRefs.current[sec.id] = el; }}
                      className={`${styles.editPreviewSection} ${i === activeSectionIdx && !viewOnly ? styles.editPreviewSectionActive : ""}`}
                    >
                      <h2>{sec.title}</h2>
                      <MarkdownBlock content={sec.content} />
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PolicyPage;
