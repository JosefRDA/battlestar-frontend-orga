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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Edit2, Trash2, Search, Loader2, Save, X, CheckCircle, AlertCircle, Plus, Copy, Check } from "lucide-react";

const API_BASE = "http://localhost:4000";

type PartEventType = "creation" | "destruction" | "changement_place" | "scan" | "evenement_systeme" | "changement_sante";

interface Part {
  id: string;
  rifd: string;
  partType?: { id: string; name: string } | null;
}

interface User {
  id: string;
  name: string;
}

interface PartPlace {
  id: string;
  name: string;
  type: string;
}

interface Terminal {
  id: string;
  name: string;
}

interface PartEvent {
  id: string;
  createdAt: string;
  partEventType: PartEventType;
  partHealth: number;
  partId?: string | null;
  userId?: string | null;
  partPlaceId?: string | null;
  terminalId?: string | null;
  part?: Part | null;
  author?: User | null;
  place?: PartPlace | null;
  terminal?: Terminal | null;
}

interface PartEventsResponse {
  data: PartEvent[];
}

interface PartListItem {
  id: string;
  label: string;
}

interface UserListItem {
  id: string;
  label: string;
}

interface PartPlaceListItem {
  id: string;
  label: string;
}

interface TerminalListItem {
  id: string;
  label: string;
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
  const [partList, setPartList] = useState<PartListItem[]>([]);
  const [copiedField, setCopiedField] = useState<{type: 'id' | 'type' | 'health' | 'part' | 'author' | 'place' | 'terminal' | 'timestamp'; value: string} | null>(null);

  const handleCopy = async (value: string, type: 'id' | 'type' | 'health' | 'part' | 'author' | 'place' | 'terminal' | 'timestamp') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField({ type, value });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const [userList, setUserList] = useState<UserListItem[]>([]);
  const [partPlaceList, setPartPlaceList] = useState<PartPlaceListItem[]>([]);
  const [terminalList, setTerminalList] = useState<TerminalListItem[]>([]);
  const [loadingRelations, setLoadingRelations] = useState(false);

  // Fetch part events on mount
  useEffect(() => {
    fetchPartEvents();
    fetchLists();
  }, []);

  const fetchPartEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/part-events?full=true`);
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

  // Fetch resource lists for dropdowns
  const fetchLists = async () => {
    setLoadingRelations(true);
    setError(null);
    try {
      const [partsRes, usersRes, partPlacesRes, terminalsRes] = await Promise.all([
        fetch(`${API_BASE}/parts?full=true`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/part-places`),
        fetch(`${API_BASE}/terminals`),
      ]);
      if (!partsRes.ok || !usersRes.ok || !partPlacesRes.ok || !terminalsRes.ok) {
        throw new Error(`HTTP ${partsRes.status} ${usersRes.status} ${partPlacesRes.status} ${terminalsRes.status}`);
      }
      const [partsData, usersData, partPlacesData, terminalsData] = await Promise.all([
        partsRes.json(),
        usersRes.json(),
        partPlacesRes.json(),
        terminalsRes.json(),
      ]);
      // Format part labels: part.id + " " + part.partType.name
      setPartList(
        (partsData.data || []).map((p: Part) => ({
          id: p.id,
          label: `${p.id} ${p.partType?.name || ""}`.trim(),
        }))
      );
      // Format user labels: user.name
      setUserList((usersData.data || []).map((u: User) => ({ id: u.id, label: u.name })));
      // Format partPlace labels: PartPlace.name + "(" + PartPlace.type + ")"
      setPartPlaceList(
        (partPlacesData.data || []).map((pp: PartPlace) => ({
          id: pp.id,
          label: `${pp.name}(${pp.type})`,
        }))
      );
      // Format terminal labels: Terminal.name
      setTerminalList((terminalsData.data || []).map((t: Terminal) => ({ id: t.id, label: t.name })));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoadingRelations(false);
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
            (event.part
              ? `${event.part.id} ${event.part.partType?.name || ""}`
                  .toLowerCase()
                  .includes(term)
              : false) ||
            (event.author?.name.toLowerCase().includes(term) ?? false) ||
            (event.place
              ? `${event.place.name}(${event.place.type})`.toLowerCase().includes(term)
              : false) ||
            (event.terminal?.name.toLowerCase().includes(term) ?? false) ||
            (event.createdAt?.toLowerCase().includes(term) ?? false)
        )
      );
    }
  }, [searchTerm, partEvents]);

  const handleEditClick = (event: PartEvent) => {
    setEditingId(event.id);
    setEditData({
      partEventType: event.partEventType,
      partHealth: event.partHealth,
      partId: event.part?.id || undefined,
      userId: event.author?.id || undefined,
      partPlaceId: event.place?.id || undefined,
      terminalId: event.terminal?.id || undefined,
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
            placeholder="Search part events by type, health, id, date..."
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
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Timestamp Création</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading part events...
                    </div>
                  </td>
                </tr>
              ) : filteredPartEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
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
                      <div className="flex items-center gap-1">
                        {editingId === event.id ? (
                          <span className="text-zinc-400">{event.id}</span>
                        ) : (
                          event.id
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(event.id, 'id')}
                          aria-label="Copy ID"
                        >
                          {copiedField?.type === 'id' && copiedField?.value === event.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(event.partEventType.replace("_", " "), 'type')}
                          aria-label="Copy Type"
                        >
                          {copiedField?.type === 'type' && copiedField?.value === event.partEventType.replace("_", " ") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(String(event.partHealth), 'health')}
                          aria-label="Copy Health"
                        >
                          {copiedField?.type === 'health' && copiedField?.value === String(event.partHealth) ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {editingId === event.id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                                <span>
                                  {editData.partId
                                    ? partList.find((p) => p.id === editData.partId)?.label || "—"
                                    : "[Aucun]"}
                                </span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                              <DropdownMenuItem
                                onClick={() => setEditData({ ...editData, partId: "" })}
                                className={editData.partId === "" ? "bg-accent" : ""}
                              >
                                [Aucun]
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {partList.map((item) => (
                                <DropdownMenuItem
                                  key={item.id}
                                  onClick={() => setEditData({ ...editData, partId: item.id })}
                                  className={editData.partId === item.id ? "bg-accent" : ""}
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          event.part
                            ? `${event.part.id} ${event.part.partType?.name || ""}`.trim()
                            : "—"
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(`${event.part?.id || ""} ${event.part?.partType?.name || ""}`.trim() || "—", 'part')}
                          aria-label="Copy Part"
                        >
                          {copiedField?.type === 'part' && copiedField?.value === (`${event.part?.id || ""} ${event.part?.partType?.name || ""}`.trim() || "—") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {editingId === event.id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                                <span>
                                  {editData.userId
                                    ? userList.find((u) => u.id === editData.userId)?.label || "—"
                                    : "[Aucun]"}
                                </span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                              <DropdownMenuItem
                                onClick={() => setEditData({ ...editData, userId: "" })}
                                className={editData.userId === "" ? "bg-accent" : ""}
                              >
                                [Aucun]
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {userList.map((item) => (
                                <DropdownMenuItem
                                  key={item.id}
                                  onClick={() => setEditData({ ...editData, userId: item.id })}
                                  className={editData.userId === item.id ? "bg-accent" : ""}
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          event.author?.name || "—"
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(event.author?.name || "—", 'author')}
                          aria-label="Copy Author"
                        >
                          {copiedField?.type === 'author' && copiedField?.value === (event.author?.name || "—") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {editingId === event.id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                                <span>
                                  {editData.partPlaceId
                                    ? partPlaceList.find((pp) => pp.id === editData.partPlaceId)?.label || "—"
                                    : "[Aucun]"}
                                </span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                              <DropdownMenuItem
                                onClick={() => setEditData({ ...editData, partPlaceId: "" })}
                                className={editData.partPlaceId === "" ? "bg-accent" : ""}
                              >
                                [Aucun]
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {partPlaceList.map((item) => (
                                <DropdownMenuItem
                                  key={item.id}
                                  onClick={() => setEditData({ ...editData, partPlaceId: item.id })}
                                  className={editData.partPlaceId === item.id ? "bg-accent" : ""}
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          event.place ? `${event.place.name}(${event.place.type})` : "—"
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(event.place ? `${event.place.name}(${event.place.type})` : "—", 'place')}
                          aria-label="Copy Place"
                        >
                          {copiedField?.type === 'place' && copiedField?.value === (event.place ? `${event.place.name}(${event.place.type})` : "—") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {editingId === event.id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                                <span>
                                  {editData.terminalId
                                    ? terminalList.find((t) => t.id === editData.terminalId)?.label || "—"
                                    : "[Aucun]"}
                                </span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                              <DropdownMenuItem
                                onClick={() => setEditData({ ...editData, terminalId: "" })}
                                className={editData.terminalId === "" ? "bg-accent" : ""}
                              >
                                [Aucun]
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {terminalList.map((item) => (
                                <DropdownMenuItem
                                  key={item.id}
                                  onClick={() => setEditData({ ...editData, terminalId: item.id })}
                                  className={editData.terminalId === item.id ? "bg-accent" : ""}
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          event.terminal?.name || "—"
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(event.terminal?.name || "—", 'terminal')}
                          aria-label="Copy Terminal"
                        >
                          {copiedField?.type === 'terminal' && copiedField?.value === (event.terminal?.name || "—") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {event.createdAt ? new Date(event.createdAt).toLocaleString() : "—"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(event.createdAt ? new Date(event.createdAt).toLocaleString() : "—", 'timestamp')}
                          aria-label="Copy Timestamp"
                        >
                          {copiedField?.type === 'timestamp' && copiedField?.value === (event.createdAt ? new Date(event.createdAt).toLocaleString() : "—") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
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
                          <Dialog open={deleteConfirmId === event.id} onOpenChange={(open) => open ? setDeleteConfirmId(event.id) : setDeleteConfirmId(null)}>
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
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
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
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Part (optional)</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                      <span>
                        {createData.partId
                          ? partList.find((p) => p.id === createData.partId)?.label || "—"
                          : "[Aucun]"}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                    <DropdownMenuItem
                      onClick={() => setCreateData({ ...createData, partId: "" })}
                      className={createData.partId === "" ? "bg-accent" : ""}
                    >
                      [Aucun]
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {partList.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => setCreateData({ ...createData, partId: item.id })}
                        className={createData.partId === item.id ? "bg-accent" : ""}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Author (optional)</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                      <span>
                        {createData.userId
                          ? userList.find((u) => u.id === createData.userId)?.label || "—"
                          : "[Aucun]"}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                    <DropdownMenuItem
                      onClick={() => setCreateData({ ...createData, userId: "" })}
                      className={createData.userId === "" ? "bg-accent" : ""}
                    >
                      [Aucun]
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {userList.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => setCreateData({ ...createData, userId: item.id })}
                        className={createData.userId === item.id ? "bg-accent" : ""}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Place (optional)</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                      <span>
                        {createData.partPlaceId
                          ? partPlaceList.find((pp) => pp.id === createData.partPlaceId)?.label || "—"
                          : "[Aucun]"}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                    <DropdownMenuItem
                      onClick={() => setCreateData({ ...createData, partPlaceId: "" })}
                      className={createData.partPlaceId === "" ? "bg-accent" : ""}
                    >
                      [Aucun]
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {partPlaceList.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => setCreateData({ ...createData, partPlaceId: item.id })}
                        className={createData.partPlaceId === item.id ? "bg-accent" : ""}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Terminal (optional)</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
                      <span>
                        {createData.terminalId
                          ? terminalList.find((t) => t.id === createData.terminalId)?.label || "—"
                          : "[Aucun]"}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                    <DropdownMenuItem
                      onClick={() => setCreateData({ ...createData, terminalId: "" })}
                      className={createData.terminalId === "" ? "bg-accent" : ""}
                    >
                      [Aucun]
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {terminalList.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => setCreateData({ ...createData, terminalId: item.id })}
                        className={createData.terminalId === item.id ? "bg-accent" : ""}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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