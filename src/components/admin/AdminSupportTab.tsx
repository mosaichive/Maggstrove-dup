import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Loader2, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const AdminSupportTab = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoReply, setAutoReply] = useState("");
  const [savingAutoReply, setSavingAutoReply] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchConversations(false); fetchAutoReply(); }, []);

  // Real-time conversations list updates (silent)
  useEffect(() => {
    const channel = supabase
      .channel('admin-conversations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_conversations' }, () => {
        fetchConversations(true);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, () => {
        fetchConversations(true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Realtime active conversation messages
  useEffect(() => {
    if (!activeConvo) return;
    const channel = supabase
      .channel(`admin-support-${activeConvo.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "support_messages",
        filter: `conversation_id=eq.${activeConvo.id}`,
      }, (payload) => {
        setMessages((prev) => {
          const newMsg = payload.new as Message;
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvo?.id]);

  const fetchConversations = async (silent: boolean) => {
    if (!silent) setLoading(true);
    const { data } = await supabase
      .from("support_conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    setConversations((data as any as Conversation[]) || []);
    if (!silent) setLoading(false);
  };

  const fetchMessages = async (convoId: string) => {
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });
    setMessages((data as any as Message[]) || []);
  };

  const fetchAutoReply = async () => {
    const { data } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "support_auto_reply")
      .single();
    if (data) setAutoReply((data as any).value);
  };

  const handleSelectConvo = async (convo: Conversation) => {
    setActiveConvo(convo);
    await fetchMessages(convo.id);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvo || !user) return;
    setSending(true);
    await supabase.from("support_messages").insert({
      conversation_id: activeConvo.id,
      sender_id: user.id,
      message: newMessage.trim(),
      is_admin: true,
    } as any);
    await supabase.from("support_conversations")
      .update({ updated_at: new Date().toISOString() } as any)
      .eq("id", activeConvo.id);
    setNewMessage("");
    setSending(false);
  };

  const handleSaveAutoReply = async () => {
    setSavingAutoReply(true);
    const { error } = await supabase
      .from("admin_settings")
      .upsert({ key: "support_auto_reply", value: autoReply, updated_at: new Date().toISOString() } as any);
    if (error) toast.error("Failed to save");
    else toast.success("Auto-reply updated!");
    setSavingAutoReply(false);
  };

  const handleCloseConvo = async (convoId: string) => {
    await supabase.from("support_conversations").update({ status: "closed" } as any).eq("id", convoId);
    fetchConversations(false);
    if (activeConvo?.id === convoId) setActiveConvo(prev => prev ? { ...prev, status: "closed" } : null);
  };

  const openCount = conversations.filter(c => c.status === "open").length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {openCount > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">{openCount} open conversation{openCount !== 1 ? "s" : ""}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{conversations.length} total conversations</span>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="w-4 h-4" /> Auto-Reply Settings
        </Button>
      </div>

      {showSettings && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Label className="text-xs font-semibold">Auto-Reply Message</Label>
            <Textarea value={autoReply} onChange={(e) => setAutoReply(e.target.value)} rows={3} className="text-sm" />
            <Button size="sm" onClick={handleSaveAutoReply} disabled={savingAutoReply}>
              {savingAutoReply && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Save
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Conversations List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {conversations.map((c) => (
            <Card
              key={c.id}
              className={cn("cursor-pointer transition-all hover:shadow-md", activeConvo?.id === c.id && "ring-2 ring-primary")}
              onClick={() => handleSelectConvo(c)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <Badge className={c.status === "open" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
                    {c.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {conversations.length === 0 && <p className="text-center text-muted-foreground py-8">No support conversations</p>}
        </div>

        {/* Chat */}
        {activeConvo ? (
          <Card className="flex flex-col max-h-[600px]">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{activeConvo.subject}</CardTitle>
              {activeConvo.status === "open" && (
                <Button size="sm" variant="outline" onClick={() => handleCloseConvo(activeConvo.id)}>Close</Button>
              )}
            </CardHeader>
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.is_admin ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 text-sm",
                    msg.is_admin ? "bg-foreground text-background" : "bg-secondary text-foreground border border-border"
                  )}>
                    <p>{msg.message}</p>
                    <p className={cn("text-[10px] mt-1", msg.is_admin ? "text-background/60" : "text-muted-foreground")}>
                      {msg.is_admin ? "Admin" : "Customer"} · {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-border p-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Reply..."
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              />
              <Button size="sm" onClick={handleSend} disabled={sending || !newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground py-12">
            <p className="text-sm">Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportTab;
