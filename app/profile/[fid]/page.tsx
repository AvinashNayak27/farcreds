"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
  ArrowLeft,
  Twitter,
  Github,
  Instagram,
  Linkedin,
  CheckCircle,
  Shield,
} from "lucide-react";
import { ClientProvider } from "@/components/client-provider";
import { ProBadge } from "@/app/page";

type UserProfile = {
  bio: {
    text: string;
    mentions: string[];
    channelMentions: string[];
  };
  location: {
    placeId: string;
    description: string;
  };
  earlyWalletAdopter: boolean;
  totalEarned?: number; // optional because not all users may have this
  accountLevel: string;
};

type User = {
  fid: number;
  displayName: string;
  profile: UserProfile;
  followerCount: number;
  followingCount: number;
  username: string;
  pfp: {
    url: string;
    verified: boolean;
  };
  viewerContext: {
    following: boolean;
    followedBy: boolean;
    enableNotifications: boolean;
  };
};

interface LinkedAccount {
  platform: string;
  username: string;
  icon: any;
  verified: boolean;
  color: string;
}

export default function ProfilePage() {
  const { themeClasses } = useDarkMode();
  const router = useRouter();
  const params = useParams();
  const fid = params.fid as string;

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom colors
  const colors = {
    purple: "rgb(112, 90, 180)",
    blue: "rgba(0, 0, 238, 1)",
  };

  // For now, we'll keep mock linked accounts since there's no API for this yet
  // In a real implementation, this would also come from an API
  const mockLinkedAccounts: LinkedAccount[] = [
    {
      platform: "Twitter",
      username: "@example",
      icon: Twitter,
      verified: true,
      color: "text-blue-400",
    },
    {
      platform: "GitHub",
      username: "example",
      icon: Github,
      verified: true,
      color: "text-gray-700",
    },
    {
      platform: "LinkedIn",
      username: "example",
      icon: Linkedin,
      verified: false,
      color: "text-blue-500",
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!fid) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/user?fid=${fid}`);

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUserProfile(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [fid]);

  if (loading) {
    return (
      <ClientProvider>
        <div className={`flex flex-col h-full ${themeClasses.background}`}>
          {/* Header Skeleton */}
          <div className="pt-4">
            <div className="h-6 w-24 mx-auto bg-gray-100  rounded animate-pulse mb-6"></div>
          </div>

          {/* Profile Section Skeleton */}
          <div className="flex-1 px-6 pb-20">
            <div className="text-center mb-8 flex flex-col items-center">
              {/* Avatar Skeleton */}
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-100  animate-pulse"></div>
              </div>

              {/* Name Skeleton */}
              <div className="h-6 w-32 bg-gray-100  rounded animate-pulse mb-2"></div>

              {/* Handle Skeleton */}
              <div className="h-4 w-20 bg-gray-100  rounded animate-pulse mb-3"></div>

              {/* Bio Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-3 w-64 bg-gray-100  rounded animate-pulse"></div>
                <div className="h-3 w-48 bg-gray-100  rounded animate-pulse"></div>
              </div>
            </div>

            {/* Linked Accounts Section Skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-100  rounded animate-pulse mb-4"></div>

              {/* Account Cards Skeleton */}
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${themeClasses.cardBg} ${themeClasses.cardBorder}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Icon Skeleton */}
                      <div className="w-5 h-5 bg-gray-100  rounded animate-pulse"></div>
                      <div>
                        {/* Platform Name Skeleton */}
                        <div className="h-4 w-16 bg-gray-100  rounded animate-pulse mb-1"></div>
                        {/* Username Skeleton */}
                        <div className="h-3 w-20 bg-gray-100  rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Badge Skeleton */}
                      <div className="h-5 w-16 bg-gray-100  rounded-full animate-pulse"></div>
                      {/* Button Skeleton */}
                      <div className="w-6 h-6 bg-gray-100  rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ClientProvider>
    );
  }

  if (error || !userProfile) {
    return (
      <div className={`flex flex-col h-full ${themeClasses.background}`}>
        <div className="p-6 pt-4">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className={`p-2 ${themeClasses.text}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1
              className={`text-xl font-bold flex-1 text-center ${themeClasses.text}`}
            >
              Profile
            </h1>
            <div className="w-9"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={`text-center ${themeClasses.textSecondary}`}>
            {error || "Profile not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${themeClasses.background}`}>
      {/* Header with Back Button */}
      <div className="pt-4">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className={`p-2 ${themeClasses.text}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1
            className={`text-xl font-bold flex-1 text-center ${themeClasses.text}`}
          >
            Profile
          </h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative">
            <img
              src={userProfile.pfp.url}
              alt={`${userProfile.username} avatar`}
              className="w-20 h-20 rounded-full"
            />
            {userProfile.profile.accountLevel?.toLowerCase() === "pro" && (
              <div className="absolute bottom-0 right-0">
                <ProBadge />
              </div>
            )}
          </div>
          <h1
            className={`text-xl font-bold mb-1 text-center ${themeClasses.text}`}
          >
            {userProfile.displayName}
          </h1>
          <p className={`mb-3 text-center ${themeClasses.textSecondary}`}>
            @{userProfile.username}
          </p>

          {/* Display bio if available */}
          {userProfile.profile.bio && (
            <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed mb-4">
              {userProfile.profile.bio.text}
            </p>
          )}
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="flex-1 px-6">
        <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
          Linked Accounts
        </h2>
        <div className="space-y-3">
          {mockLinkedAccounts.length > 0 ? (
            mockLinkedAccounts.map((account, index) => (
              <Card
                key={index}
                className={`${themeClasses.cardBg} ${themeClasses.cardBorder}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
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
                    {account.verified ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-yellow-500 border-yellow-500/30"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card
              className={`${themeClasses.cardBg} ${themeClasses.cardBorder}`}
            >
              <CardContent className="p-4 text-center">
                <p className={`${themeClasses.textSecondary}`}>
                  No linked accounts found
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4 pb-4">
        <Badge className="border" style={{ backgroundColor: "#0000ff" }}>
          <Shield className="w-3 h-3 mr-1" />
          Verified via Reclaim Protocol
        </Badge>
      </div>
    </div>
  );
}
