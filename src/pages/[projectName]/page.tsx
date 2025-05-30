"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Twitter,
  MessageCircle,
  FileText,
  Users,
  Target,
  Trophy,
  Calendar,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type TeamMember = {
  name: string;
  xHandle: string;
};

type Milestone = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

type Achievement = {
  description: string;
};

type Product = {
  id: string;
  uuid: string;
  name: string;
  bDescription: string;
  description: string;
  logoURI: string;
  bannerURI: string;
  state: string;
  track: string;
  walletAddress: string;
  twitterURL?: string;
  telegramURL?: string;
  websiteURL?: string;
  status: "PENDING" | "DECLINED" | "PUBLISHED";
  documentationURL?: string;
  teamMembers: TeamMember[];
  milestones: Milestone[];
  achievements: Achievement[];
};

const ProjectDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const baseUrl = import.meta.env.VITE_ENDPOINT_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status) {
          const foundProduct = response.data.data.find(
            (item: Product) => item.uuid === uuid
          );
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError("Project not found.");
          }
        } else {
          setError("Failed to fetch project data.");
        }
      } catch (err) {
        console.error("Error fetching project detail:", err);
        setError("An error occurred while fetching project details.");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchProject();
    }
  }, [uuid, baseUrl]);

  const copyWalletAddress = async () => {
    if (product?.walletAddress) {
      try {
        await navigator.clipboard.writeText(product.walletAddress);
        setCopied(true);
        toast("Wallet address copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast("Could not copy wallet address");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DECLINED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrackColor = (track: string) => {
    const colors = {
      Defi: "bg-blue-100 text-blue-800 border-blue-200",
      Gaming: "bg-purple-100 text-purple-800 border-purple-200",
      Ai: "bg-pink-100 text-pink-800 border-pink-200",
      DePin: "bg-green-100 text-green-800 border-green-200",
      Infra: "bg-orange-100 text-orange-800 border-orange-200",
      Consumers: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return (
      colors[track as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="text-slate-600 font-medium">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 font-medium mb-4">
              Project not found.
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <Card className="overflow-hidden mb-8 shadow-xl">
          {/* Banner */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-slate-900 to-slate-700">
            {product.bannerURI ? (
              <img
                src={product.bannerURI || "/placeholder.svg"}
                alt={`${product.name} Banner`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/80">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-lg font-medium">Project Banner</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Project Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-end gap-6">
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={product.logoURI || "/placeholder.svg"}
                    alt={product.name}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {product.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 truncate">
                    {product.name}
                  </h1>
                  <p className="text-white/90 text-lg mb-3">
                    {product.bDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTrackColor(product.track)}>
                      {product.track}
                    </Badge>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  About This Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Milestones */}
            {product.milestones && product.milestones.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {milestone.title}
                        </h4>
                        <p className="text-slate-600 mb-2">
                          {milestone.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(milestone.startDate).toLocaleDateString()}
                          </span>
                          <span>→</span>
                          <span>
                            {new Date(milestone.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {product.achievements && product.achievements.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                        <p className="text-slate-700">
                          {achievement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">
                    State
                  </label>
                  <p className="text-slate-900 font-medium">{product.state}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-slate-500">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded flex-1 truncate">
                      {product.walletAddress.slice(0, 8)}...
                      {product.walletAddress.slice(-6)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyWalletAddress}
                      className="h-8 w-8 p-0"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.websiteURL && (
                    <a
                      href={product.websiteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-slate-600" />
                      <span className="font-medium">Website</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                    </a>
                  )}

                  {product.twitterURL && (
                    <a
                      href={product.twitterURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Twitter</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                    </a>
                  )}

                  {product.telegramURL && (
                    <a
                      href={product.telegramURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Telegram</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                    </a>
                  )}

                  {product.documentationURL && (
                    <a
                      href={product.documentationURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-slate-600" />
                      <span className="font-medium">Documentation</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            {product.teamMembers && product.teamMembers.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            @{member.xHandle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
