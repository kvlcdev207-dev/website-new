"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const mockEvents = [
  { id: "1", title: "Campus Clean-Up Drive", date: "2026-10-02", location: "College Campus, Block A", type: "Service", status: "Published", description: "A morning of cleaning and tidying the campus with gloves and bags provided." },
  { id: "2", title: "Teachers&apos; Day Program", date: "2026-09-28", location: "College Auditorium", type: "Meeting", status: "Published", description: "A student-run program to honor the campus teachers." },
  { id: "3", title: "Leo Year Kick-Off Meeting", date: "2026-10-09", location: "College Hall", type: "Meeting", status: "Published", description: "The new executive board was installed at our kick-off meeting." },
  { id: "4", title: "Book Donation for the Library", date: "2026-10-24", location: "Campus Library", type: "Service", status: "Draft", description: "Bring your old textbooks and story books to stock the student library." },
  { id: "5", title: "Winter Clothes Drive", date: "2026-12-12", location: "Boudhanath Area", type: "Service", status: "Draft", description: "Collecting warm clothes from students to share with families nearby." },
];

const eventTypes = ["Service", "Meeting", "Workshop", "Social", "Fundraiser", "Other"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    type: "Service",
    description: "",
    status: "Draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Event saved! (Mock action)");
    setFormData({ title: "", date: "", location: "", type: "Service", description: "", status: "Draft" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this event?")) {
      alert(`Event ${id} deleted! (Mock action)`);
    }
  };

  const handleEdit = (event: typeof mockEvents[0]) => {
    setActiveTab("add");
    setFormData({ ...event });
  };

  return (
    <div className="min-h-screen bg-leo-gray/5">
      {/* Sidebar + Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 bg-white border-r border-leo-gray/10 flex-col">
          <div className="p-6 border-b border-leo-gray/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-leo-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl">KVLC</span>
              </div>
              <span className="font-bold text-xl text-leo-blue">Admin</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("add")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "add"
                  ? "bg-leo-blue text-white shadow-lg shadow-leo-blue/30"
                  : "text-leo-gray hover:bg-leo-gray/5 hover:text-leo-blue"
              }`}
            >
              <svg className="inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add New Event
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "manage"
                  ? "bg-leo-blue text-white shadow-lg shadow-leo-blue/30"
                  : "text-leo-gray hover:bg-leo-gray/5 hover:text-leo-blue"
              }`}
            >
              <svg className="inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              Manage Events
            </button>
          </nav>
          <div className="p-4 border-t border-leo-gray/10 text-sm text-leo-gray/60">
            KVLC Admin Dashboard v1.0
          </div>
        </aside>

        {/* Mobile Top Tabs */}
        <div className="lg:hidden bg-white border-b border-leo-gray/10 sticky top-0 z-40">
          <div className="flex overflow-x-auto px-2 py-2">
            <button
              onClick={() => setActiveTab("add")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "add"
                  ? "bg-leo-blue text-white"
                  : "text-leo-gray hover:bg-leo-gray/5"
              }`}
            >
              Add New Event
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2 ${
                activeTab === "manage"
                  ? "bg-leo-blue text-white"
                  : "text-leo-gray hover:bg-leo-gray/5"
              }`}
            >
              Manage Events
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-leo-blue">Admin Dashboard</h1>
              <p className="mt-2 text-leo-gray">Manage events and content for the club website.</p>
            </div>
          </FadeIn>

          {/* Add New Event Form */}
          <FadeIn delay={100}>
            <section className={activeTab === "add" ? "block" : "hidden"}>
              <div className="bg-white rounded-2xl border border-leo-gray/10 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-leo-blue">Add New Event</h2>
                    <p className="mt-1 text-leo-gray">Fill in the details below to create a new event.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-leo-gray mb-1">Event Title *</label>
                      <input
                        id="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray placeholder:text-leo-gray/40 focus:border-leo-blue focus:ring-2 focus:ring-leo-blue/20 focus:outline-none transition-colors"
                        placeholder="e.g., Campus Clean-Up Drive"
                      />
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-leo-gray mb-1">Date *</label>
                      <input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray focus:border-leo-blue focus:ring-2 focus:ring-leo-blue/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-leo-gray mb-1">Location *</label>
                      <input
                        id="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray placeholder:text-leo-gray/40 focus:border-leo-blue focus:ring-2 focus:ring-leo-blue/20 focus:outline-none transition-colors"
                        placeholder="e.g., College Campus, Block A"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-leo-gray mb-1">Event Type *</label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray focus:border-leo-blue focus:ring-2 focus:ring-leo-blue/20 focus:outline-none transition-colors"
                      >
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-leo-gray mb-1">Description *</label>
                    <textarea
                      id="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray placeholder:text-leo-gray/40 focus:border-leo-blue focus:ring-2 focus:ring-leo-blue/20 focus:outline-none transition-colors resize-y"
                      placeholder="Brief description of the event..."
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-leo-gray mb-1">Status</label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="mt-1 block w-full max-w-xs rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray focus:border-leo-blue focus:ring-2 focus:ring-leo-blue/20 focus:outline-none transition-colors"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-leo-gray/10">
                    <button
                      type="button"
                      onClick={() => setFormData({ title: "", date: "", location: "", type: "Service", description: "", status: "Draft" })}
                      className="px-5 py-2.5 text-sm font-medium text-leo-gray bg-leo-gray/10 rounded-lg transition-all duration-300 hover:bg-leo-gray/20"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="bg-leo-blue text-white px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-leo-blue/90 hover:scale-105 hover:shadow-lg hover:shadow-leo-blue/30"
                    >
                      Publish Event
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </FadeIn>

          {/* Manage Events List */}
          <FadeIn delay={100}>
            <section className={activeTab === "manage" ? "block" : "hidden"}>
              <div className="bg-white rounded-2xl border border-leo-gray/10 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-leo-gray/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-leo-blue">Manage Events</h2>
                      <p className="mt-1 text-leo-gray">View, edit, or delete existing events.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("add")}
                      className="bg-leo-blue text-white px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-leo-blue/90 hover:scale-105 hover:shadow-lg hover:shadow-leo-blue/30"
                    >
                      <svg className="inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Event
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-leo-gray/5">
                      <tr className="text-left text-sm font-semibold text-leo-gray">
                        <th className="px-6 py-4">Event Title</th>
                        <th className="px-6 py-4 hidden md:table-cell">Date</th>
                        <th className="px-6 py-4 hidden lg:table-cell">Location</th>
                        <th className="px-6 py-4 hidden md:table-cell">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-leo-gray/10">
                      {mockEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-leo-gray/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-leo-blue">{event.title}</td>
                          <td className="px-6 py-4 hidden md:table-cell text-leo-gray">{event.date}</td>
                          <td className="px-6 py-4 hidden lg:table-cell text-leo-gray/70 max-w-xs truncate">{event.location}</td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-leo-blue/10 text-leo-blue">{event.type}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.status === "Published"
                                ? "bg-leo-green/10 text-leo-green"
                                : "bg-leo-yellow/10 text-leo-yellow"
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(event)}
                                className="p-2 text-leo-gray hover:text-leo-blue hover:bg-leo-blue/5 rounded-lg transition-colors"
                                aria-label="Edit event"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="p-2 text-leo-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Delete event"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty state for mobile */}
                <div className="lg:hidden p-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl border border-leo-gray/10 p-4 mb-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-bold text-leo-blue">{event.title}</h4>
                          <p className="text-sm text-leo-gray/70">{event.date} · {event.location}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-leo-blue/10 text-leo-blue">{event.type}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              event.status === "Published"
                                ? "bg-leo-green/10 text-leo-green"
                                : "bg-leo-yellow/10 text-leo-yellow"
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(event)} className="p-2 text-leo-gray hover:text-leo-blue hover:bg-leo-blue/5 rounded-lg">Edit</button>
                        <button onClick={() => handleDelete(event.id)} className="p-2 text-leo-gray hover:text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}