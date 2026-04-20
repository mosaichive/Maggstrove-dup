import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Send, Loader2, MessageCircle, Bot, ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatStep =
  | "greeting"
  | "order_question"
  | "order_list"
  | "issue_select"
  | "auto_response"
  | "follow_up"
  | "agent_chat"
  | "non_order_menu"
  | "done";

interface BotMessage {
  id: string;
  text: string;
  isBot: boolean;
  options?: { label: string; value: string }[];
  timestamp: Date;
}

interface UserOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  shipping_name: string;
  payment_method: string;
}

interface LiveMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface SupportChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDER_ISSUES = [
  { label: "Order Confirmation", value: "order_confirmation" },
  { label: "Order Tracking", value: "order_tracking" },
  { label: "Payment Issue", value: "payment_issue" },
  { label: "Delivery Issue", value: "delivery_issue" },
  { label: "Order Cancellation", value: "order_cancellation" },
  { label: "Returns and Warranty", value: "returns_warranty" },
  { label: "Refund Status", value: "refund_status" },
  { label: "Other order-related inquiry", value: "other_order" },
  { label: "Inquiry not related to an order", value: "non_order" },
];

const NON_ORDER_ISSUES = [
  { label: "Product Availability", value: "product_availability" },
  { label: "Sizing Help", value: "sizing_help" },
  { label: "Account Issue", value: "account_issue" },
  { label: "General Inquiry", value: "general_inquiry" },
];

const FOLLOW_UP_OPTIONS = [
  { label: "No, thank you", value: "done" },
  { label: "Yes, I want to chat with an agent", value: "agent" },
  { label: "Yes, return to main menu", value: "restart" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const msgId = () => crypto.randomUUID();

const statusLabels: Record<string, string> = {
  pending: "📦 Order Placed",
  processing: "⚙️ Processing",
  confirmed: "✅ Confirmed",
  shipped: "🚚 Shipped",
  out_for_delivery: "🏍️ Out for Delivery",
  delivered: "✅ Delivered",
  cancelled: "❌ Cancelled",
};

// ─── Component ────────────────────────────────────────────────────────────────

const SupportChat = ({ open, onOpenChange }: SupportChatProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<ChatStep>("greeting");
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [userName, setUserName] = useState("there");
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [loading, setLoading] = useState(false);

  // Agent chat state
  const [agentConvoId, setAgentConvoId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveMessages]);

  // Clean up old chats & start conversation on open
  useEffect(() => {
    if (open && user) {
      initChat();
    }
    if (!open) {
      resetChat();
    }
  }, [open, user]);

  // Realtime for agent chat
  useEffect(() => {
    if (!agentConvoId) return;
    const channel = supabase
      .channel(`support-live-${agentConvoId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "support_messages",
        filter: `conversation_id=eq.${agentConvoId}`,
      }, (payload) => {
        const newMsg = payload.new as LiveMessage;
        setLiveMessages((prev) => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [agentConvoId]);

  const initChat = async () => {
    if (!user) return;
    setLoading(true);

    // Clean up old chats (24h)
    try {
      await supabase.rpc("cleanup_old_support_chats" as any, { p_user_id: user.id });
    } catch (e) {
      console.warn("Cleanup failed:", e);
    }

    // Fetch user name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    const name = profile?.full_name || "there";
    setUserName(name);

    // Fetch orders
    const { data: userOrders } = await supabase
      .from("orders")
      .select("id, order_number, status, total, created_at, shipping_name, payment_method")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders((userOrders as UserOrder[]) || []);

    // Start the greeting
    setMessages([
      {
        id: msgId(),
        text: `Hi ${name}, I am Maggs Trove Virtual Assistant. I am here to answer your questions.`,
        isBot: true,
        timestamp: new Date(),
      },
      {
        id: msgId(),
        text: "Are you contacting us regarding an existing order?",
        isBot: true,
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        timestamp: new Date(),
      },
    ]);
    setStep("order_question");
    setLoading(false);
  };

  const resetChat = () => {
    setStep("greeting");
    setMessages([]);
    setSelectedOrder(null);
    setAgentConvoId(null);
    setLiveMessages([]);
    setNewMessage("");
  };

  const addBotMsg = useCallback((text: string, options?: { label: string; value: string }[]) => {
    setMessages((prev) => [...prev, { id: msgId(), text, isBot: true, options, timestamp: new Date() }]);
  }, []);

  const addUserMsg = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: msgId(), text, isBot: false, timestamp: new Date() }]);
  }, []);

  // ─── Option Handlers ─────────────────────────────────────────────────────

  const handleOrderQuestion = (value: string) => {
    if (value === "yes") {
      addUserMsg("Yes");
      if (orders.length === 0) {
        addBotMsg("It looks like you don't have any orders yet. Is there anything else I can help you with?", NON_ORDER_ISSUES);
        setStep("non_order_menu");
      } else {
        addBotMsg("Please select the order you need help with:");
        setStep("order_list");
      }
    } else {
      addUserMsg("No");
      addBotMsg("What can I help you with?", NON_ORDER_ISSUES);
      setStep("non_order_menu");
    }
  };

  const handleOrderSelect = async (order: UserOrder) => {
    setSelectedOrder(order);
    addUserMsg(`Order ${order.order_number}`);

    // Fetch latest tracking
    const { data: tracking } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const latestStatus = tracking?.[0]?.status || order.status;
    const statusLabel = statusLabels[latestStatus] || latestStatus;

    addBotMsg(`Order ${order.order_number}\nStatus: ${statusLabel}\nTotal: GH₵${Number(order.total).toFixed(2)}\nPayment: ${order.payment_method}\n\nWhat can I help you with?`, ORDER_ISSUES);
    setStep("issue_select");
  };

  const handleIssueSelect = (value: string) => {
    if (value === "non_order") {
      const issue = ORDER_ISSUES.find(i => i.value === value);
      addUserMsg(issue?.label || value);
      addBotMsg("What can I help you with?", NON_ORDER_ISSUES);
      setStep("non_order_menu");
      return;
    }

    const issue = ORDER_ISSUES.find(i => i.value === value);
    addUserMsg(issue?.label || value);

    // Provide context-aware response based on selected issue
    const order = selectedOrder;
    let response = "";

    switch (value) {
      case "order_confirmation":
        response = order
          ? `Your order ${order.order_number} was placed on ${new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Current status: ${statusLabels[order.status] || order.status}.`
          : "Please provide your order number so we can look it up for you.";
        break;
      case "order_tracking":
        response = order
          ? `Your order ${order.order_number} is currently: ${statusLabels[order.status] || order.status}. You can also track your order at any time by visiting the Track Order page.`
          : "You can track your order using your order number on our Track Order page.";
        break;
      case "payment_issue":
        response = order
          ? `Your order ${order.order_number} was placed with ${order.payment_method}. If you're experiencing payment issues, we recommend chatting with an agent for further assistance.`
          : "For payment-related issues, please chat with an agent who can assist you directly.";
        break;
      case "delivery_issue":
        response = order
          ? `Your order ${order.order_number} status is: ${statusLabels[order.status] || order.status}. If there's a delivery concern, our team can help resolve it.`
          : "For delivery issues, please chat with an agent who can investigate further.";
        break;
      case "order_cancellation":
        response = "Order cancellations can only be processed before shipping. Please chat with an agent to request a cancellation.";
        break;
      case "returns_warranty":
        response = "We offer returns within 7 days of delivery for items in original condition. Visit our Returns page for more details, or chat with an agent.";
        break;
      case "refund_status":
        response = "Refunds are typically processed within 5-7 business days after we receive the returned item. For a specific update, please chat with an agent.";
        break;
      default:
        response = "Thank you for reaching out. For detailed assistance, please chat with an agent.";
    }

    addBotMsg(response);
    setTimeout(() => {
      addBotMsg("Is there anything else we can do for you?", FOLLOW_UP_OPTIONS);
      setStep("follow_up");
    }, 500);
  };

  const handleNonOrderMenu = (value: string) => {
    const issue = NON_ORDER_ISSUES.find(i => i.value === value);
    addUserMsg(issue?.label || value);

    let response = "";
    switch (value) {
      case "product_availability":
        response = "You can check product availability on our website. Items marked as 'Sold' are currently unavailable. For restocking inquiries, chat with an agent.";
        break;
      case "sizing_help":
        response = "Visit our Size Guide page for detailed measurements and fitting advice. If you need more help, our team is happy to assist.";
        break;
      case "account_issue":
        response = "For account-related issues like password resets or profile updates, please check your Account Settings. For further help, chat with an agent.";
        break;
      default:
        response = "Thank you for your inquiry. For personalized assistance, please chat with an agent.";
    }

    addBotMsg(response);
    setTimeout(() => {
      addBotMsg("Is there anything else we can do for you?", FOLLOW_UP_OPTIONS);
      setStep("follow_up");
    }, 500);
  };

  const handleFollowUp = async (value: string) => {
    if (value === "done") {
      addUserMsg("No, thank you");
      addBotMsg("Thank you for contacting Maggs Trove! Have a wonderful day. 💛");
      setStep("done");
    } else if (value === "agent") {
      addUserMsg("Yes, I want to chat with an agent");
      addBotMsg("Connecting you to an agent... Please wait.");
      await transferToAgent();
    } else if (value === "restart") {
      addUserMsg("Yes, return to main menu");
      addBotMsg("Are you contacting us regarding an existing order?", [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ]);
      setStep("order_question");
    }
  };

  // ─── Agent Transfer ───────────────────────────────────────────────────────

  const transferToAgent = async () => {
    if (!user) return;

    const subject = selectedOrder
      ? `Order ${selectedOrder.order_number} - Support`
      : "General Inquiry";

    const { data: convo, error } = await supabase
      .from("support_conversations")
      .insert({ user_id: user.id, subject } as any)
      .select()
      .single();

    if (error || !convo) {
      toast.error("Failed to connect to agent");
      return;
    }

    const convoId = (convo as any).id;
    setAgentConvoId(convoId);

    // Send context summary as first message
    const contextParts: string[] = [];
    messages.forEach(m => {
      if (!m.options) contextParts.push(`${m.isBot ? "Bot" : "Customer"}: ${m.text}`);
    });
    const contextSummary = contextParts.slice(-6).join("\n");

    await supabase.from("support_messages").insert({
      conversation_id: convoId,
      sender_id: user.id,
      message: `[Virtual Assistant Summary]\n${contextSummary}`,
      is_admin: false,
    } as any);

    // Fetch messages
    const { data: msgs } = await supabase
      .from("support_messages")
      .select("*")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });

    setLiveMessages((msgs as any as LiveMessage[]) || []);
    setStep("agent_chat");
    addBotMsg("You're now connected to our support team. An agent will respond shortly.");
  };

  const handleSendAgentMessage = async () => {
    if (!newMessage.trim() || !agentConvoId || !user) return;
    setSending(true);
    const { error } = await supabase.from("support_messages").insert({
      conversation_id: agentConvoId,
      sender_id: user.id,
      message: newMessage.trim(),
      is_admin: false,
    } as any);
    if (error) toast.error("Failed to send");
    else {
      setNewMessage("");
      await supabase.from("support_conversations")
        .update({ updated_at: new Date().toISOString() } as any)
        .eq("id", agentConvoId);
    }
    setSending(false);
  };

  // ─── Option Click Handler ─────────────────────────────────────────────────

  const handleOptionClick = (value: string) => {
    switch (step) {
      case "order_question":
        handleOrderQuestion(value);
        break;
      case "issue_select":
        handleIssueSelect(value);
        break;
      case "non_order_menu":
        handleNonOrderMenu(value);
        break;
      case "follow_up":
        handleFollowUp(value);
        break;
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Help & Support
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Bot conversation messages */}
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.isBot ? "justify-start" : "justify-end")} style={{ animation: "fadeIn 0.3s ease-in" }}>
                  <div className={cn(
                    "max-w-[85%] px-3 py-2 text-sm rounded-lg",
                    msg.isBot
                      ? "bg-secondary text-foreground border border-border"
                      : "bg-foreground text-background"
                  )}>
                    {msg.isBot && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Bot className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Maggs Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.options && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.options.map((opt) => (
                          <Button
                            key={opt.value}
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 transition-all hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleOptionClick(opt.value)}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    <p className={cn("text-[10px] mt-1", msg.isBot ? "text-muted-foreground" : "text-background/60")}>
                      {msg.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Order list */}
              {step === "order_list" && (
                <div className="space-y-2" style={{ animation: "fadeIn 0.3s ease-in" }}>
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => handleOrderSelect(order)}
                      className="w-full text-left p-3 bg-secondary/50 border border-border hover:bg-secondary rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold">{order.order_number}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-muted rounded">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-xs font-semibold">GH₵{Number(order.total).toFixed(2)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Agent live messages */}
              {step === "agent_chat" && liveMessages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.is_admin ? "justify-start" : "justify-end")} style={{ animation: "fadeIn 0.3s ease-in" }}>
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 text-sm rounded-lg",
                    msg.is_admin
                      ? "bg-secondary text-foreground border border-border"
                      : "bg-foreground text-background"
                  )}>
                    <p className="whitespace-pre-line">{msg.message}</p>
                    <p className={cn("text-[10px] mt-1", msg.is_admin ? "text-muted-foreground" : "text-background/60")}>
                      {msg.is_admin ? "Agent" : "You"} · {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Agent chat input */}
            {step === "agent_chat" && (
              <div className="border-t border-border p-4 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendAgentMessage()}
                />
                <Button size="sm" onClick={handleSendAgentMessage} disabled={sending || !newMessage.trim()}>
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            )}

            {/* Done state */}
            {step === "done" && (
              <div className="border-t border-border p-4">
                <Button variant="outline" className="w-full text-xs" onClick={() => onOpenChange(false)}>
                  Close Chat
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SupportChat;
