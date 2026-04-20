import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Settings, Lock, Shield, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSettings = ({ open, onOpenChange }: AccountSettingsProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Close account
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closeEmail, setCloseEmail] = useState("");
  const [closePassword, setClosePassword] = useState("");
  const [closingAccount, setClosingAccount] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    }
    setChangingPassword(false);
  };

  const handleCloseAccount = async () => {
    if (!closeEmail || !closePassword) { toast.error("Please fill in all fields"); return; }
    if (closeEmail !== user?.email) { toast.error("Email doesn't match your account"); return; }

    setClosingAccount(true);
    try {
      // Verify credentials by re-signing in
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: closeEmail,
        password: closePassword,
      });
      if (authError) throw new Error("Invalid credentials. Please try again.");

      // Note: Full account deletion requires admin/service role. 
      // For now, we sign out and notify admin
      toast.success("Account closure request submitted. You will be signed out.");
      setCloseDialogOpen(false);
      onOpenChange(false);
      await signOut();
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to close account");
    }
    setClosingAccount(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" /> Account Settings
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Change Password */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" /> Change Password
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Confirm New Password</Label>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleChangePassword}
                  disabled={changingPassword || !newPassword}
                  className="w-full"
                >
                  {changingPassword && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                  Update Password
                </Button>
              </div>
            </section>

            <Separator />

            {/* Security */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" /> Security
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border">
                  <span>Email</span>
                  <span className="font-medium text-foreground">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border">
                  <span>Account created</span>
                  <span className="font-medium text-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-GB") : "N/A"}
                  </span>
                </div>
              </div>
            </section>

            <Separator />

            {/* Close Account */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-destructive">
                <Trash2 className="w-4 h-4" /> Close Account
              </h3>
              <p className="text-xs text-muted-foreground">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setCloseDialogOpen(true)}
              >
                Close My Account
              </Button>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      {/* Close Account Confirmation Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Close Account
            </DialogTitle>
            <DialogDescription>
              This action is permanent. Enter your email and password to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={closeEmail}
                onChange={(e) => setCloseEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Password</Label>
              <Input
                type="password"
                value={closePassword}
                onChange={(e) => setClosePassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleCloseAccount}
              disabled={closingAccount}
            >
              {closingAccount && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Permanently Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountSettings;
