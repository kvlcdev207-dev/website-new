"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/FadeIn";
import ImageUpload from "@/components/ImageUpload";

const eventTypes = ["Service", "Meeting", "Workshop", "Social", "Fundraiser", "Other"];

// Event status is always worked out from the date, never picked by hand
const eventStatusFromDate = (date: string) => {
  const iso = date ? date.split("T")[0] : "";
  const today = new Date().toISOString().split("T")[0];
  if (iso && iso < today) return "past";
  if (iso === today) return "today";
  return "upcoming";
};

const statusStyles: Record<string, string> = {
  past: "bg-leo-gray/10 text-leo-gray",
  today: "bg-leo-yellow/10 text-leo-yellow",
  upcoming: "bg-leo-green/10 text-leo-green",
};

type Event = {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  location: string;
  type: string;
  status: string;
  description: string;
  imageUrl?: string;
};

type FormState = {
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
};

const emptyForm: FormState = {
  title: "",
  date: "",
  location: "",
  type: eventTypes[0],
  description: "",
};

const impactFields = [
  { key: "peopleHelped", label: "People helped" },
  { key: "eventsHeld", label: "Events held" },
  { key: "volunteerHours", label: "Volunteer hours" },
  { key: "activeMembers", label: "Active members" },
] as const;

type ImpactKey = (typeof impactFields)[number]["key"];
type ImpactForm = Record<ImpactKey, string>;

type LiteratureItem = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  date: string;
  likes?: number;
  comments?: unknown[];
};

const pastWorkYears = ["2026/27", "2025/26"];

type UserRow = {
  name?: string;
  email: string;
  role: string;
  // True when this row is the club's super admin account
  isSuperAdmin: boolean;
};

type PastWorkItem = {
  _id?: string;
  id?: string;
  title: string;
  year: string;
  description: string;
  imageUrl?: string;
};

type PastWorkFormState = {
  title: string;
  year: string;
  description: string;
  imageUrl: string;
};

const emptyPastWorkForm: PastWorkFormState = {
  title: "",
  year: pastWorkYears[0],
  description: "",
  imageUrl: "",
};

type Message = { text: string; kind: "success" | "error" } | null;

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(`${iso.split("T")[0]}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

// Literature dates are stored as ISO strings or human-readable strings
const formatLiteratureDate = (value: string) => {
  if (!value) return "";
  const d = new Date(`${value.split("T")[0]}T00:00:00Z`);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return value;
};

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "events" | "literature" | "pastwork" | "admins" | "settings"
  >("events");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [literature, setLiterature] = useState<LiteratureItem[]>([]);
  const [literatureLoading, setLiteratureLoading] = useState(true);
  const [pastWork, setPastWork] = useState<PastWorkItem[]>([]);
  const [pastWorkLoading, setPastWorkLoading] = useState(true);
  const [pastWorkForm, setPastWorkForm] =
    useState<PastWorkFormState>(emptyPastWorkForm);
  const [pastWorkEditingId, setPastWorkEditingId] = useState<string | null>(
    null
  );
  const [pastWorkSubmitting, setPastWorkSubmitting] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [impact, setImpact] = useState<ImpactForm>({
    peopleHelped: "0",
    eventsHeld: "0",
    volunteerHours: "0",
    activeMembers: "0",
  });
  const [message, setMessage] = useState<Message>(null);

  const isSuperAdmin = session?.user?.role === "superadmin";

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ text: "Could not load events.", kind: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Load the current impact numbers on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setImpact({
            peopleHelped: String(data.peopleHelped ?? 0),
            eventsHeld: String(data.eventsHeld ?? 0),
            volunteerHours: String(data.volunteerHours ?? 0),
            activeMembers: String(data.activeMembers ?? 0),
          });
        }
      } catch (error) {
        console.error("Failed to load impact numbers:", error);
      }
    }
    fetchSettings();
  }, []);

  // Load all literature for the Manage Literature tab
  const fetchLiterature = useCallback(async () => {
    try {
      const res = await fetch("/api/literature");
      if (!res.ok) throw new Error("Failed to fetch literature");
      const data = await res.json();
      setLiterature(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ text: "Could not load literature.", kind: "error" });
    } finally {
      setLiteratureLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiterature();
  }, [fetchLiterature]);

  // Load all past work for the Manage Past Work tab
  const fetchPastWork = useCallback(async () => {
    try {
      const res = await fetch("/api/past-work");
      if (!res.ok) throw new Error("Failed to fetch past work");
      const data = await res.json();
      setPastWork(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ text: "Could not load past work.", kind: "error" });
    } finally {
      setPastWorkLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPastWork();
  }, [fetchPastWork]);

  // Load all registered users when the Manage Admins tab is opened
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch {
      setMessage({ text: "Could not load users.", kind: "error" });
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "admins") {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      if (editingId) {
        const res = await fetch(`/api/events/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update event");
        setMessage({ text: "Event updated successfully!", kind: "success" });
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create event");
        setMessage({ text: "Event published successfully!", kind: "success" });
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchEvents();
    } catch {
      setMessage({
        text: editingId ? "Could not update event." : "Could not publish event.",
        kind: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setForm({
      title: event.title,
      date: event.date ? event.date.split("T")[0] : "",
      location: event.location,
      type: event.type,
      description: event.description,
    });
    setEditingId(event._id || event.id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setMessage({ text: "Event deleted.", kind: "success" });
      await fetchEvents();
    } catch {
      setMessage({ text: "Could not delete event.", kind: "error" });
    }
  };

  const handleDeleteLiterature = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this writing?")) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/literature/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete writing");
      setMessage({ text: "Writing deleted.", kind: "success" });
      await fetchLiterature();
    } catch {
      setMessage({ text: "Could not delete writing.", kind: "error" });
    }
  };

  const handleSavePastWork = async (e: FormEvent) => {
    e.preventDefault();
    setPastWorkSubmitting(true);
    setMessage(null);
    try {
      if (pastWorkEditingId) {
        const res = await fetch(`/api/past-work/${pastWorkEditingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pastWorkForm),
        });
        if (!res.ok) throw new Error("Failed to update past work");
        setMessage({ text: "Past work updated successfully!", kind: "success" });
      } else {
        const res = await fetch("/api/past-work", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pastWorkForm),
        });
        if (!res.ok) throw new Error("Failed to create past work");
        setMessage({ text: "Past work created successfully!", kind: "success" });
      }
      setPastWorkForm(emptyPastWorkForm);
      setPastWorkEditingId(null);
      await fetchPastWork();
    } catch {
      setMessage({
        text: pastWorkEditingId
          ? "Could not update past work."
          : "Could not create past work.",
        kind: "error",
      });
    } finally {
      setPastWorkSubmitting(false);
    }
  };

  const handleEditPastWork = (item: PastWorkItem) => {
    setPastWorkForm({
      title: item.title,
      year: item.year,
      description: item.description,
      imageUrl: item.imageUrl || "",
    });
    setPastWorkEditingId(item._id || item.id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePastWork = async (id: string) => {
    if (!window.confirm("Delete this past work item? This cannot be undone."))
      return;
    setMessage(null);
    try {
      const res = await fetch(`/api/past-work/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete past work");
      setMessage({ text: "Past work item deleted.", kind: "success" });
      await fetchPastWork();
    } catch {
      setMessage({ text: "Could not delete past work.", kind: "error" });
    }
  };

  const handleSetRole = async (email: string, role: "admin" | "user") => {
    setMessage(null);
    setChangingRole(email);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      setMessage({
        text:
          role === "admin"
            ? "User promoted to admin."
            : "Admin access removed.",
        kind: "success",
      });
      await fetchUsers();
    } catch (error) {
      setMessage({
        text:
          error instanceof Error ? error.message : "Could not update role.",
        kind: "error",
      });
    } finally {
      setChangingRole(null);
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peopleHelped: Number(impact.peopleHelped) || 0,
          eventsHeld: Number(impact.eventsHeld) || 0,
          volunteerHours: Number(impact.volunteerHours) || 0,
          activeMembers: Number(impact.activeMembers) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      setMessage({ text: "Impact numbers saved!", kind: "success" });
    } catch (error) {
      setMessage({
        text:
          error instanceof Error ? error.message : "Could not save impact numbers.",
        kind: "error",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-leo-gray/5">
        <p className="text-leo-gray">Loading…</p>
      </div>
    );
  }

  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-leo-gray/5">
        <p className="text-leo-gray">Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leo-gray/5">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <FadeIn>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-leo-blue sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-leo-gray">
              Manage events, past work, literature, impact numbers and, as the
              super admin, other admins.
            </p>
          </header>
        </FadeIn>

        {message && (
          <FadeIn>
            <div
              role="status"
              className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
                message.kind === "success"
                  ? "bg-leo-green/10 text-leo-green"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message.text}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={100}>
          <div className="mb-8 flex gap-6 border-b border-leo-gray/20">
            <button
              onClick={() => setActiveTab("events")}
              className={`pb-2 font-medium transition-colors ${
                activeTab === "events"
                  ? "border-b-2 border-leo-blue text-leo-blue"
                  : "text-leo-gray hover:text-leo-blue"
              }`}
            >
              Manage Events
            </button>
            <button
              onClick={() => setActiveTab("pastwork")}
              className={`pb-2 font-medium transition-colors ${
                activeTab === "pastwork"
                  ? "border-b-2 border-leo-blue text-leo-blue"
                  : "text-leo-gray hover:text-leo-blue"
              }`}
            >
              Manage Past Work
            </button>
            <button
              onClick={() => setActiveTab("literature")}
              className={`pb-2 font-medium transition-colors ${
                activeTab === "literature"
                  ? "border-b-2 border-leo-blue text-leo-blue"
                  : "text-leo-gray hover:text-leo-blue"
              }`}
            >
              Manage Literature
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab("admins")}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === "admins"
                    ? "border-b-2 border-leo-blue text-leo-blue"
                    : "text-leo-gray hover:text-leo-blue"
                }`}
              >
                Manage Admins
              </button>
            )}
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-2 font-medium transition-colors ${
                activeTab === "settings"
                  ? "border-b-2 border-leo-blue text-leo-blue"
                  : "text-leo-gray hover:text-leo-blue"
              }`}
            >
              Site Settings
            </button>
          </div>
        </FadeIn>

        {activeTab === "events" ? (
          <>
            <FadeIn>
              <section className="mb-10 rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                  {editingId ? "Edit Event" : "Add New Event"}
                </h2>
                <form
                  onSubmit={handleAddEvent}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="event-title"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Title
                    </label>
                    <input
                      id="event-title"
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="event-date"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Date
                    </label>
                    <input
                      id="event-date"
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="event-location"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Location
                    </label>
                    <input
                      id="event-location"
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="event-type"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Type
                    </label>
                    <select
                      id="event-type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    >
                      {eventTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="event-description"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Description
                    </label>
                    <textarea
                      id="event-description"
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                  <div className="flex gap-3 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-md bg-leo-blue px-5 py-2 font-medium text-white hover:bg-leo-blue/90 disabled:opacity-50"
                    >
                      {editingId ? "Update Event" : "Publish Event"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm(emptyForm);
                          setEditingId(null);
                        }}
                        className="rounded-md border border-leo-gray/30 px-5 py-2 font-medium text-leo-gray hover:bg-leo-gray/5"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </FadeIn>

            <FadeIn delay={150}>
              <section className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                  Current Events
                </h2>
                {loading ? (
                  <p className="text-leo-gray">Loading events…</p>
                ) : events.length === 0 ? (
                  <p className="text-leo-gray">
                    No events yet. Publish one above.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-leo-gray/20 text-leo-gray">
                          <th className="px-3 py-2 font-medium">Title</th>
                          <th className="px-3 py-2 font-medium">Date</th>
                          <th className="px-3 py-2 font-medium">Location</th>
                          <th className="px-3 py-2 font-medium">Type</th>
                          <th className="px-3 py-2 font-medium">Status</th>
                          <th className="px-3 py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => {
                          const id = event._id || event.id || "";
                          const status = eventStatusFromDate(event.date);
                          return (
                            <tr
                              key={id}
                              className="border-b border-leo-gray/10 last:border-0"
                            >
                              <td className="px-3 py-2 font-medium text-gray-900">
                                {event.title}
                              </td>
                              <td className="px-3 py-2 text-leo-gray">
                                {formatDate(event.date)}
                              </td>
                              <td className="px-3 py-2 text-leo-gray">
                                {event.location}
                              </td>
                              <td className="px-3 py-2 text-leo-gray">
                                {event.type}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditEvent(event)}
                                    className="rounded-md bg-leo-blue/10 px-3 py-1 font-medium text-leo-blue hover:bg-leo-blue/20"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => id && handleDeleteEvent(id)}
                                    className="rounded-md bg-red-50 px-3 py-1 font-medium text-red-600 hover:bg-red-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </FadeIn>
          </>
        ) : activeTab === "literature" ? (
          <FadeIn>
            <section className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                All Literature
              </h2>
              {literatureLoading ? (
                <p className="text-leo-gray">Loading literature…</p>
              ) : literature.length === 0 ? (
                <p className="text-leo-gray">No writings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-leo-gray/20 text-leo-gray">
                        <th className="px-3 py-2 font-medium">Title</th>
                        <th className="px-3 py-2 font-medium">Author</th>
                        <th className="px-3 py-2 font-medium">Category</th>
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {literature.map((item) => {
                        const id = item._id || item.id || "";
                        return (
                          <tr
                            key={id}
                            className="border-b border-leo-gray/10 last:border-0"
                          >
                            <td className="px-3 py-2 font-medium text-gray-900">
                              {item.title}
                            </td>
                            <td className="px-3 py-2 text-leo-gray">
                              {item.author}
                            </td>
                            <td className="px-3 py-2 text-leo-gray">
                              {item.category}
                            </td>
                            <td className="px-3 py-2 text-leo-gray">
                              {formatLiteratureDate(item.date)}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => id && handleDeleteLiterature(id)}
                                className="rounded-md bg-red-50 px-3 py-1 font-medium text-red-600 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </FadeIn>
        ) : activeTab === "pastwork" ? (
          <>
            <FadeIn>
              <section className="mb-10 rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                  {pastWorkEditingId ? "Edit Past Work" : "Add Past Work"}
                </h2>
                <form
                  onSubmit={handleSavePastWork}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="pastwork-title"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Title
                    </label>
                    <input
                      id="pastwork-title"
                      type="text"
                      required
                      value={pastWorkForm.title}
                      onChange={(e) =>
                        setPastWorkForm({ ...pastWorkForm, title: e.target.value })
                      }
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pastwork-year"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Year
                    </label>
                    <select
                      id="pastwork-year"
                      value={pastWorkForm.year}
                      onChange={(e) =>
                        setPastWorkForm({ ...pastWorkForm, year: e.target.value })
                      }
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    >
                      {pastWorkYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="mb-1 block text-sm font-medium text-leo-gray">
                      Image
                    </span>
                    <ImageUpload
                      imageUrl={pastWorkForm.imageUrl}
                      onUpload={(url) =>
                        setPastWorkForm({ ...pastWorkForm, imageUrl: url })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="pastwork-description"
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      Description
                    </label>
                    <textarea
                      id="pastwork-description"
                      rows={4}
                      required
                      value={pastWorkForm.description}
                      onChange={(e) =>
                        setPastWorkForm({
                          ...pastWorkForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                  <div className="flex gap-3 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={pastWorkSubmitting}
                      className="rounded-md bg-leo-blue px-5 py-2 font-medium text-white hover:bg-leo-blue/90 disabled:opacity-50"
                    >
                      {pastWorkEditingId ? "Update Past Work" : "Add Past Work"}
                    </button>
                    {pastWorkEditingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setPastWorkForm(emptyPastWorkForm);
                          setPastWorkEditingId(null);
                        }}
                        className="rounded-md border border-leo-gray/30 px-5 py-2 font-medium text-leo-gray hover:bg-leo-gray/5"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </FadeIn>

            <FadeIn delay={150}>
              <section className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                  All Past Work
                </h2>
                {pastWorkLoading ? (
                  <p className="text-leo-gray">Loading past work…</p>
                ) : pastWork.length === 0 ? (
                  <p className="text-leo-gray">
                    No past work yet. Add some above.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-leo-gray/20 text-leo-gray">
                          <th className="px-3 py-2 font-medium">Title</th>
                          <th className="px-3 py-2 font-medium">Year</th>
                          <th className="px-3 py-2 font-medium">Description</th>
                          <th className="px-3 py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastWork.map((item) => {
                          const id = item._id || item.id || "";
                          return (
                            <tr
                              key={id}
                              className="border-b border-leo-gray/10 last:border-0"
                            >
                              <td className="px-3 py-2 font-medium text-gray-900">
                                {item.title}
                              </td>
                              <td className="px-3 py-2 text-leo-gray">
                                {item.year}
                              </td>
                              <td className="max-w-xs px-3 py-2 text-leo-gray">
                                <span className="line-clamp-2">
                                  {item.description}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditPastWork(item)}
                                    className="rounded-md bg-leo-blue/10 px-3 py-1 font-medium text-leo-blue hover:bg-leo-blue/20"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => id && handleDeletePastWork(id)}
                                    className="rounded-md bg-red-50 px-3 py-1 font-medium text-red-600 hover:bg-red-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </FadeIn>
          </>
        ) : activeTab === "admins" ? (
          <FadeIn>
            <section className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                All Registered Users
              </h2>
              {usersLoading ? (
                <p className="text-leo-gray">Loading users…</p>
              ) : users.length === 0 ? (
                <p className="text-leo-gray">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-leo-gray/20 text-leo-gray">
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Email</th>
                        <th className="px-3 py-2 font-medium">Role</th>
                        <th className="px-3 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.email}
                          className="border-b border-leo-gray/10 last:border-0"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">
                            {user.name || "—"}
                          </td>
                          <td className="px-3 py-2 text-leo-gray">
                            {user.email}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                user.role === "superadmin"
                                  ? "bg-leo-yellow/10 text-leo-yellow"
                                  : user.role === "admin"
                                    ? "bg-leo-blue/10 text-leo-blue"
                                    : "bg-leo-gray/10 text-leo-gray"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {user.isSuperAdmin ? (
                              <span className="text-xs text-leo-gray">
                                Super admin — cannot be changed
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSetRole(
                                    user.email,
                                    user.role === "user" ? "admin" : "user"
                                  )
                                }
                                disabled={changingRole === user.email}
                                className={
                                  user.role === "user"
                                    ? "rounded-md bg-leo-blue/10 px-3 py-1 font-medium text-leo-blue hover:bg-leo-blue/20 disabled:opacity-50"
                                    : "rounded-md bg-red-50 px-3 py-1 font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                                }
                              >
                                {changingRole === user.email
                                  ? "Updating…"
                                  : user.role === "user"
                                    ? "Promote to Admin"
                                    : "Remove Admin"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </FadeIn>
        ) : (
          <FadeIn>
            <section className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-leo-blue">
                Impact Numbers
              </h2>
              <p className="mb-4 text-sm text-leo-gray">
                These figures appear in the &quot;Our impact&quot; section on
                the home page.
              </p>
              <form
                onSubmit={handleSaveSettings}
                className="grid gap-4 sm:grid-cols-2"
              >
                {impactFields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`impact-${field.key}`}
                      className="mb-1 block text-sm font-medium text-leo-gray"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`impact-${field.key}`}
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={impact[field.key]}
                      onChange={(e) => {
                        const next = { ...impact };
                        next[field.key] = e.target.value;
                        setImpact(next);
                      }}
                      className="w-full rounded-md border border-leo-gray/30 px-3 py-2 text-gray-900 focus:border-leo-blue focus:outline-none focus:ring-1 focus:ring-leo-blue"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="rounded-md bg-leo-blue px-5 py-2 font-medium text-white hover:bg-leo-blue/90 disabled:opacity-50"
                  >
                    {savingSettings ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
