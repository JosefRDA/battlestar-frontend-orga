"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Search, Loader2, Save, X, CheckCircle, AlertCircle, Plus } from "lucide-react";

const API_BASE = "http://localhost:4000";

type PartEventType = "creation" | "destruction" | "changement_place" | "scan" | "evenement_systeme" | "changement_sante";

interface PartEvent {
  id: string;
  createdAt: string;
  partEventType: PartEventType;
  partHealth: number;
  partId?: string | null;
  userId?: string | null;
  partPlaceId?: string | null;
  terminalId?: string | null;
  part?: {
    id: string;
    name: string;
  } | null;
  author?: {
    id: string;
    name: string;
  } | null;
  place?: {
    id: string;
    name: string;
  } | null;
  terminal?: {
    id: string;
    name: string;
  } | null;
}

interface PartEventsResponse {
  data: PartEvent[];
}

export default function PartEventsTestPanel() {
  const [partEvents, setPartEvents] = useState<PartEvent[]>([]);
  const [filteredPartEvents, setFilteredPartEvents] = useState<PartEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PartEvent>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<PartEvent>>({
    partEventType: "creation",
    partHealth: 0,
  });

  // Fetch part events on mount
  useEffect(() => {
    fetchPartEvents();
  }, []);

  const fetchPartEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/part-events`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PartEventsResponse = await res.json();
      setPartEvents(data.data || []);
      setFilteredPartEvents(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setPartEvents([]);
      setFilteredPartEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter part events based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPartEvents(partEvents);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredPartEvents(
        partEvents.filter(
          (event) =>
            event.partEventType.toLowerCase().includes(term) ||
            event.partHealth.toString().toLowerCase().includes(term) ||
            event.id.toLowerCase().includes(term) ||
            (event.part?.name.toLowerCase().includes(term) ?? false) ||
            (event.author?.name.toLowerCase().includes(term) ?? false) ||
            (event.place?.name.toLowerCase().includes(term) ?? false) ||
            (event.terminal?.name.toLowerCase().includes(term) ?? false)
        )
      );
    }
  }, [searchTerm, partEvents]);

  const handleEditClick = (event: PartEvent) => {
    setEditingId(event.id);
    setEditData({
      partEventType: event.partEventType,
      partHealth: event.partHealth,
      partId: event.part?.id,
      userId: event.author?.id,
      partPlaceId: event.place?.id,
      terminalId: event.terminal?.id,
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/part-events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part event updated successfully");
      setEditingId(null);
      fetchPartEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update part event";
      setError(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeletingId(deleteConfirmId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/part-events/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part event deleted successfully");
      fetchPartEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete part event";
      setError(message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleCreateClick = () => {
    setCreateData({
      partEventType: "creation",
      partHealth: 0,
    });
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/part-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part event created successfully");
      setCreateModalOpen(false);
      fetchPartEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create part event";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalOpen(false);
    setCreateData({
      partEventType: "creation",
      partHealth: 0,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          Part Events Management
        </CardTitle>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          New Part Event
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search part events by type, health, id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status messages */}
        {(error || success) && (
          <div
            className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              error ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" :
              "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            }`}
          >
            {error ? <AlertCircle className="h-4 w-4 flex-shrink-0" /> : <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            <span>{error || success}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6"
              onClick={() => { setError(null); setSuccess(null); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Part events table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Type</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Health</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Part</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Author</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Place</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Terminal</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading part events...
                    </div>
                  </td>
                </tr>
              ) : filteredPartEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    {searchTerm ? "No part events match your search" : "No part events found"}
                  </td>
                </tr>
              ) : (
                filteredPartEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {editingId === event.id ? (
                        <Input
                          value={editData.id as string}
                          onChange={(e) => setEditData({ ...editData, id: e.target.value })}
                          className="w-full"
                          readOnly
                        />
                      ) : (
                        event.id
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === event.id ? (
                        <select
                          value={editData.partEventType as PartEventType}
                          onChange={(e) => setEditData({ ...editData, partEventType: e.target.value as PartEventType })}
                          className="w-full p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                        >
                          <option value="creation">creation</option>
                          <option value="destruction">destruction</option>
                          <option value="changement_place">changement_place</option>
                          <option value="scan">scan</option>
                          <option value="evenement_systeme">evenement_systeme</option>
                          <option value="changement_sante">changement_sante</option>
                        </select>
                      ) : (
                        <span className="capitalize">{event.partEventType.replace("_", " ")}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === event.id ? (
                        <Input
                          type="number"
                          value={editData.partHealth ?? 0}
                          onChange={(e) => setEditData({ ...editData, partHealth: parseInt(e.target.value) || 0 })}
                          className="w-full"
                        />
                      ) : (
                        event.partHealth
                      )}
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300">
                      {editingId === event.id ? (
                        <Input
                          value={editData.partId as string || ""}
                          onChange={(e) => setEditData({ ...editData, partId: e.target.value })}
                          placeholder="Part ID"
                          className="w-full"
                        />
                      ) : (
                        event.part?.name || event.part?.id || "—"
                      )}
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300">
                      {editingId === event.id ? (
                        <Input
                          value={editData.userId as string || ""}
                          onChange={(e) => setEditData({ ...editData, userId: e.target.value })}
                          placeholder="Author ID"
                          className="w-full"
                        />
                      ) : (
                        event.author?.name || event.author?.id || "—"
                      )}
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300">
                      {editingId === event.id ? (
                        <Input
                          value={editData.partPlaceId as string || ""}
                          onChange={(e) => setEditData({ ...editData, partPlaceId: e.target.value })}
                          placeholder="Place ID"
                          className="w-full"
                        />
                      ) : (
                        event.place?.name || event.place?.id || "—"
                      )}
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300">
                      {editingId === event.id ? (
                        <Input
                          value={editData.terminalId as string || ""}
                          onChange={(e) => setEditData({ ...editData, terminalId: e.target.value })}
                          placeholder="Terminal ID"
                          className="w-full"
                        />
                      ) : (
                        event.terminal?.name || event.terminal?.id || "—"
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {editingId === event.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={savingId === event.id}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(event.id)}
                            disabled={savingId === event.id}
                          >
                            {savingId === event.id ? (
                              <Loader2 className="animate-spin h-3.5 w-3.5" />
                            ) : (
                              <Save className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(event)}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteConfirmId === event.id} onOpenChange={handleCancelDelete}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Delete Part Event</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this part event?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={handleCancelDelete}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleConfirmDelete}
                                  disabled={deletingId === event.id}
                                >
                                  {deletingId === event.id ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
          Showing {filteredPartEvents.length} of {partEvents.length} part events
        </div>

        {/* Create Part Event Modal */}
        <Dialog open={createModalOpen} onOpenChange={handleCancelCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Part Event</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new part event.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Event Type</label>
                <select
                  value={createData.partEventType as PartEventType}
                  onChange={(e) => setCreateData({ ...createData, partEventType: e.target.value as PartEventType })}
                  className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                >
                  <option value="creation">creation</option>
                  <option value="destruction">destruction</option>
                  <option value="changement_place">changement_place</option>
                  <option value="scan">scan</option>
                  <option value="evenement_systeme">evenement_systeme</option>
                  <option value="changement_sante">changement_sante</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Part Health</label>
                <Input
                  type="number"
                  value={createData.partHealth ?? 0}
                  onChange={(e) => setCreateData({ ...createData, partHealth: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Part ID (optional)</label>
                <Input
                  value={createData.partId as string || ""}
                  onChange={(e) => setCreateData({ ...createData, partId: e.target.value })}
                  placeholder="Part ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Author ID (optional)</label>
                <Input
                  value={createData.userId as string || ""}
                  onChange={(e) => setCreateData({ ...createData, userId: e.target.value })}
                  placeholder="Author ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Place ID (optional)</label>
                <Input
                  value={createData.partPlaceId as string || ""}
                  onChange={(e) => setCreateData({ ...createData, partPlaceId: e.target.value })}
                  placeholder="Place ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Terminal ID (optional)</label>
                <Input
                  value={createData.terminalId as string || ""}
                  onChange={(e) => setCreateData({ ...createData, terminalId: e.target.value })}
                  placeholder="Terminal ID"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelCreate} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Part Event"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}