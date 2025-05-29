"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Users,
  UserPlus,
} from "lucide-react"
import { sdk } from "@farcaster/frame-sdk"
import type { Context } from "@farcaster/frame-sdk"

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

type UsersResponse = {
  result: {
    users: User[];
  };
};

export default function ExplorePage() {
  const [activeExploreTab, setActiveExploreTab] = useState("followers")
  const [ctx, setCtx] = useState<Context.FrameContext | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const router = useRouter()

  // Custom colors
  const colors = {
    purple: "rgb(112, 90, 180)",
    blue: "rgba(0, 0, 238, 1)",
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setSearchLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data: UsersResponse = await response.json()
        setSearchResults(data.result.users || [])
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300),
    []
  )

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      const context = await sdk.context;
      setCtx(context);
    };
    init();
  }, []);

  useEffect(() => {
    if (ctx?.user?.fid) {
      fetchCurrentUser();
      fetchData(activeExploreTab);
    }
  }, [ctx, activeExploreTab]);

  const fetchCurrentUser = async () => {
    if (!ctx?.user?.fid) return;
    
    try {
      const response = await fetch(`/api/user?fid=${ctx.user.fid}`);
      const userData = await response.json();
      setCurrentUser(userData.user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchData = async (tab: string) => {
    if (!ctx?.user?.fid) return;
    
    setLoading(true);
    try {
      const endpoint = tab === "followers" ? "/api/followers" : "/api/following";
      const response = await fetch(`${endpoint}?fid=${ctx.user.fid}`);
      const data: UsersResponse = await response.json();
      
      if (tab === "followers") {
        setFollowers(data.result.users || []);
      } else {
        setFollowing(data.result.users || []);
      }
    } catch (error) {
      console.error(`Failed to fetch ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveExploreTab(tab);
  };

  const handleUserClick = (fid: number) => {
    router.push(`/profile/${fid}`)
  }

  const currentUsers = activeExploreTab === "followers" ? followers : following;

  return (
    <div className={`flex flex-col h-full`}>
      {/* Header */}
      <div className="p-6 pt-4">
        <h1 className={`text-xl font-bold mb-4 text-center`}>FarCreds</h1>
        <div className="relative mb-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Start typing to search users..." 
              value={searchQuery}
              onValueChange={(value) => {
                setSearchQuery(value)
                debouncedSearch(value)
              }}
            />
            <CommandList>
              {searchLoading ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : searchQuery.trim() !== "" && searchResults.length === 0 ? (
                <CommandEmpty>No users found</CommandEmpty>
              ) : searchQuery.trim() !== "" ? (
                <CommandGroup heading="Search Results">
                  {searchResults.map((user) => (
                    <CommandItem
                      key={user.fid}
                      value={`${user.displayName} @${user.username}`}
                      onSelect={() => {
                        handleUserClick(user.fid)
                        setSearchQuery("")
                      }}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.pfp.url || "/placeholder.svg"} alt={user.displayName} />
                          <AvatarFallback className="text-white text-xs" style={{ backgroundColor: colors.purple }}>
                            {user.displayName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{user.displayName}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {user.followerCount} followers
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4" style={{ borderColor: "#e5e5e5" }}>
          <button
            onClick={() => handleTabChange("followers")}
            className={`flex items-center justify-center w-1/2 py-2 font-medium text-sm ${
              activeExploreTab === "followers" ? "text-gray-900" : "text-gray-500"
            }`}
            style={activeExploreTab === "followers" ? { borderBottom: `2px solid ${colors.purple}` } : {}}
          >
            <Users className="w-4 h-4 mr-2" />
            Followers {currentUser ? (
              `(${currentUser.followerCount})`
            ) : (
              <span className="inline-block w-8 h-4 bg-gray-200 rounded animate-pulse ml-2"></span>
            )}
          </button>
          <button
            onClick={() => handleTabChange("following")}
            className={`flex items-center justify-center w-1/2 py-2 font-medium text-sm ${
              activeExploreTab === "following" ? "text-gray-900" : "text-gray-500"
            }`}
            style={activeExploreTab === "following" ? { borderBottom: `2px solid ${colors.purple}` } : {}}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Following {currentUser ? (
              `(${currentUser.followingCount})`
            ) : (
              <span className="inline-block w-8 h-4 bg-gray-200 rounded animate-pulse ml-2"></span>
            )}
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 px-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : currentUsers.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">
              {ctx?.user?.fid ? `No ${activeExploreTab} found` : "Loading user context..."}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentUsers.map((user, index) => (
              <Card
                key={user.fid}
                className="bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleUserClick(user.fid)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.pfp.url || "/placeholder.svg"} alt={user.displayName} />
                      <AvatarFallback className="text-white" style={{ backgroundColor: colors.purple }}>
                        {user.displayName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.displayName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {user.followerCount} followers
                      </p>
                      {user.viewerContext.following && (
                        <p className="text-xs text-blue-500">Following</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 