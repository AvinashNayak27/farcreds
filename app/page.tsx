"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientProvider } from "@/components/client-provider";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
  Twitter,
  Github,
  Instagram,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

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

export const ProBadge = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke-white"
      id="badge"
      fill="#7c65c1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 17 9 C 16.984699 8.44998 16.8169 7.914431 16.5147 7.45381 C 16.297401 7.122351 16.016399 6.83868 15.6895 6.61875 C 15.4741 6.47382 15.3639 6.206079 15.4143 5.9514 C 15.4908 5.56531 15.4893 5.16623 15.4095 4.777781 C 15.298 4.23797 15.0375 3.74074 14.6586 3.34142 C 14.2584 2.96254 13.762 2.70285 13.2222 2.59046 C 12.8341 2.51075 12.4353 2.5092 12.0495 2.5855 C 11.7944 2.63594 11.5263 2.52522 11.3816 2.30924 C 11.1622 1.982038 10.87893 1.700779 10.54704 1.48361 C 10.08642 1.182205 9.55087 1.013622 9 1 C 8.44998 1.014473 7.91613 1.181355 7.45636 1.48361 C 7.12562 1.701042 6.84379 1.981922 6.62575 2.30818 C 6.4811 2.52463 6.21278 2.6359 5.95742 2.58524 C 5.57065 2.50851 5.17062 2.50951 4.78118 2.59046 C 4.24053 2.70115 3.74244 2.96169 3.34227 3.34142 C 2.96339 3.74159 2.70456 4.23968 2.59472 4.77863 C 2.51504 5.16661 2.51478 5.56517 2.59204 5.9505 C 2.64317 6.20557 2.53289 6.47402 2.31683 6.618879 C 1.98923 6.83852 1.707141 7.12164 1.488719 7.45296 C 1.185611 7.91273 1.016177 8.44913 1 9 C 1.017028 9.55087 1.185611 10.08642 1.488719 10.54704 C 1.70699 10.87813 1.988839 11.1615 2.31614 11.381 C 2.53242 11.5261 2.64304 11.7948 2.59191 12.0501 C 2.51478 12.4353 2.51509 12.8336 2.59472 13.2214 C 2.70541 13.7612 2.96339 14.2584 3.34142 14.6586 C 3.74159 15.0358 4.23882 15.2946 4.77778 15.4061 C 5.16676 15.4872 5.56638 15.4885 5.95297 15.4125 C 6.2069 15.3626 6.4733 15.473 6.61752 15.6879 C 6.8374 16.015499 7.12119 16.2973 7.45381 16.515499 C 7.91358 16.8169 8.44998 16.984699 9 17 C 9.55087 16.986401 10.08642 16.8186 10.54704 16.5172 C 10.87568 16.3022 11.1566 16.023899 11.3751 15.7008 C 11.5233 15.4816 11.7988 15.3721 12.0576 15.4274 C 12.4412 15.5093 12.8397 15.5111 13.2273 15.4308 C 13.7688 15.3184 14.2661 15.0502 14.6577 14.6586 C 15.0494 14.2669 15.3184 13.7697 15.4308 13.2273 C 15.5112 12.8397 15.5093 12.4411 15.427 12.0575 C 15.3716 11.7987 15.4806 11.5231 15.6997 11.3745 C 16.022301 11.1558 16.2999 10.87482 16.515499 10.54619 C 16.8169 10.08642 16.984699 9.55002 17 9 Z M 12.1286 6.46597"
    />
    <path
      id="checkmark"
      fill="#ffffff"
      fillRule="evenodd"
      stroke="none"
      d="M 5.48206 8.829732 C 5.546341 8.757008 6.096026 8.328334 6.590207 8.831891 C 6.990357 9.239633 7.80531 10.013605 7.80531 10.013605 C 7.80531 10.013605 10.326332 7.31631 11.011629 6.559397 C 11.320887 6.21782 11.875775 6.239667 12.135474 6.515033 C 12.411443 6.807649 12.489538 7.230008 12.164574 7.601331 C 10.947777 8.991708 9.508716 10.452277 8.3795 11.706156 C 8.11062 12.004721 7.595459 12.008714 7.302509 11.735093 C 7.061394 11.509888 6.005327 10.437536 5.502547 9.931531 C 5.003333 9.429114 5.404643 8.887831 5.48206 8.829732 Z"
    />
  </svg>
);

export default function HomePage() {
  const { themeClasses } = useDarkMode();
  const [fid, setFid] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      const ctx = await sdk.context;
      setFid(ctx.user.fid);
    };
    init();
  }, []);

  // Fetch user data when fid is available
  useEffect(() => {
    const fetchUser = async () => {
      if (!fid) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/user?fid=${fid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [fid]);

  // Use fetched user data or fallback to context data
  const userProfile = {
    name: user?.displayName  || "Unknown User",
    handle: user?.username ? `@${user.username}`  : "@unknown",
    avatar: user?.pfp?.url || "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/31c292df-7624-448c-679e-acfa14b89d00/original",
    verified: user?.profile?.accountLevel?.toLowerCase() === "pro"  || false,
    bio: user?.profile?.bio?.text || "",
  };

  // Mock linked accounts (you may want to replace this with actual data from your API)
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
      username: "alexdev",
      icon: Github,
      verified: true,
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

  if (error) {
    return (
      <ClientProvider>
        <div className={`flex flex-col h-full items-center justify-center ${themeClasses.background}`}>
          <p className={`text-red-500 text-center px-6`}>Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </ClientProvider>
    );
  }

  return (
    <ClientProvider>
      <div className={`flex flex-col h-full ${themeClasses.background}`}>
        {/* Header */}
        <div className="pt-4">
          <h1
            className={`text-xl font-bold mb-6 text-center ${themeClasses.text}`}
          >
            FarCreds
          </h1>
        </div>

        {/* Profile Section */}
        <div className="flex-1 px-6">
          <div className="text-center mb-4 flex flex-col items-center">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={`${userProfile.name} avatar`}
                className="w-20 h-20 rounded-full"
              />
              {
                userProfile.verified && (
                  <div className="absolute bottom-0 right-0">
                    <ProBadge />
                  </div>
                )
              }
            </div>
            <h1
              className={`text-xl font-bold mb-1 text-center ${themeClasses.text}`}
            >
              {userProfile.name}
            </h1>
            <p className={`mb-3 text-center ${themeClasses.textSecondary}`}>
              {userProfile.handle}
            </p>
            
            {/* Display bio if available */}
            {userProfile.bio && (
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed mb-4">
                {userProfile.bio}
              </p>
            )}
            
          </div>

          {/* Connected Accounts */}
          <div className="space-y-4">
            <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
              Linked Accounts
            </h2>
            {linkedAccounts.map((account, index) => (
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
                    <div className="flex items-center space-x-3">
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
                      <Button variant="ghost" size="sm" className="p-1">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ClientProvider>
  );
}
