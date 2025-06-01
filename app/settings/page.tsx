"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
  Plus,
  Twitter,
  Github,
  Instagram,
  Linkedin,
  Unlink,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Proof, ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const APP_ID = "0xDE17a7D076F8bD127118c3985FD20378FccAcBDc";
const APP_SECRET =
  "0xbb5717d6c67678f4b942eeede9cd8fadc99b47681d246f8151e767cc62cebad0";

// Determine device type for Reclaim SDK
const getDeviceType = () => {
  if (typeof window === "undefined") return "desktop";
  const isMobileDevice =
    /android|linux aarch64|linux armv|iphone|ipad|ipod/i.test(
      window.navigator.platform
    );
  const isAppleDevice = /mac|iphone|ipad|ipod/i.test(window.navigator.platform);
  return isMobileDevice ? (isAppleDevice ? "ios" : "android") : "desktop";
};

export default function SettingsPage() {
  const { themeClasses } = useDarkMode();

  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);

  const getVerificationReq = async () => {
    // Your credentials from the Reclaim Protocol Developer Portal
    const GITHUB_PROVIDER_ID = "6d3f6753-7ee6-49ee-a545-62f1b1822ae5";

    const deviceType = getDeviceType();

    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      GITHUB_PROVIDER_ID,
      {
        device: deviceType,
        useAppClip: "desktop" !== deviceType,
      }
    );

    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    setRequestUrl(requestUrl);
    setIsVerifyDialogOpen(true);
    await reclaimProofRequest.startSession({
      onSuccess: (proofs) => {
        if (typeof proofs === "string") return proofs;
        let proofsArray: Proof[] = [];
        if (proofs) {
          proofsArray = Array.isArray(proofs) ? proofs : [proofs];
        }

        console.log("Verification success", proofs);
        setProofs(proofsArray);
        setRequestUrl("");
        setIsVerifyDialogOpen(false);

        if (proofsArray.length > 0 && proofsArray[0]?.claimData?.context) {
          try {
            const extractedUsername = JSON.parse(
              proofsArray[0].claimData.context
            )?.extractedParameters?.username;
            setGithubUsername(extractedUsername);
          } catch (error) {
            console.error("Error parsing claimData context:", error);
          }
        }
      },
      onError: (error) => {
        console.error("Verification failed", error);
        setIsVerifyDialogOpen(false);
      },
    });
  };

  // Custom colors
  const colors = {
    purple: "rgb(112, 90, 180)",
    blue: "rgba(0, 0, 238, 1)",
  };

  const linkedAccounts = [
    {
      platform: "Twitter",
      username: "@alexdev_",
      icon: Twitter,
      verified: true,
      color: "text-blue-400",
    },
    {
      platform: "GitHub",
      username: githubUsername || "Not linked",
      icon: Github,
      verified: githubUsername ? true : false,
      color: "text-gray-700",
    },
    {
      platform: "LinkedIn",
      username: "alex-developer",
      icon: Linkedin,
      verified: true,
      color: "text-blue-500",
    },
    {
      platform: "Instagram",
      username: "alexdev.codes",
      icon: Instagram,
      verified: false,
      color: "text-pink-500",
    },
  ];

  return (
    <div className={`flex flex-col h-full ${themeClasses.background}`}>
      {/* Header */}
      <div className="p-6 pt-4">
        <h1
          className={`text-xl font-bold mb-6 text-center ${themeClasses.text}`}
        >
          FarCreds
        </h1>
      </div>

      {/* Linked Accounts Management */}
      <div className="flex-1 px-6">
        <div className="mb-6">
          <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
            Linked Accounts
          </h2>
          <div className="space-y-3">
            {linkedAccounts.map((account, index) => (
              <Card
                key={index}
                className={`${themeClasses.cardBg} ${themeClasses.cardBorder}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <account.icon className={`w-5 h-5 ${account.color}`} />
                      <div>
                        <p className={`font-medium ${themeClasses.text}`}>
                          {account.platform}
                        </p>
                        <p className={`text-sm ${themeClasses.textSecondary}`}>
                          {account.username}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={account.verified ? "default" : "outline"}
                      className={
                        account.verified
                          ? "bg-green-600/20 text-green-500 border-green-500/30"
                          : "text-yellow-500 border-yellow-500/30"
                      }
                    >
                      {account.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${themeClasses.cardBorder} ${themeClasses.textSecondary} hover:bg-gray-100`}
                      onClick={
                        account.platform === "GitHub"
                          ? getVerificationReq
                          : undefined
                      }
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      {account.platform === "GitHub" ? "Verify" : "Reverify"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <Unlink className="w-3 h-3 mr-1" />
                      Unlink
                    </Button>
                  </div>
                  <Dialog open={isVerifyDialogOpen && account.platform === "GitHub" && requestUrl !== ""} onOpenChange={setIsVerifyDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Verify GitHub Account</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-[200px]">
                          <div className="bg-white rounded-lg">
                            <QRCode value={requestUrl} size={200} />
                          </div>
                        </div>
                        <button
                          onClick={() => window.location.href = requestUrl}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-60 w-[200px]"
                        >
                          Open Link
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button
          className="w-full text-white hover:opacity-90 mb-6"
          style={{ backgroundColor: colors.purple }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Link a New Account
        </Button>
      </div>
    </div>
  );
}
