"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Twitter, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

type Product = {
  id: string;
  uuid: string;
  name: string;
  bDescription: string;
  description: string;
  logoURI: string;
  bannerURI: string;
  track: string;
  twitterURL?: string;
  githubURL?: string;
  status: "PENDING" | "DECLINED" | "PUBLISHED";
  walletAddress: string;
};

const ProjectCard = ({
  product,
  onApprove,
  onDecline,
  onClick,
}: {
  product: Product;
  onApprove: (name: string) => void;
  onDecline: (name: string) => void;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          {/* Banner */}
          <div className="h-32 relative overflow-hidden rounded-t-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <img
              src={product.bannerURI || "/placeholder.svg"}
              alt=""
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 z-20 font-medium bg-background/80 backdrop-blur-sm"
            >
              {product.track}
            </Badge>
          </div>

          {/* Logo */}
          <Avatar className="absolute z-10 -bottom-6 left-4 w-12 h-12 border-4 border-background shadow-md">
            <AvatarImage
              src={product.logoURI || "/placeholder.svg"}
              alt={product.name}
            />
            <AvatarFallback className="bg-primary/10 font-bold">
              {product.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Status badge */}
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold shadow ${
                product.status === "PUBLISHED"
                  ? "bg-green-500/60 text-green-800"
                  : product.status === "DECLINED"
                  ? "bg-red-400/60 text-red-700"
                  : "bg-yellow-400/60 text-yellow-700"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        <CardContent className="pt-8 pb-2 px-4 flex flex-col h-[calc(100%-8rem)]">
          <div className="flex-1 flex flex-col justify-start items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-left">
              {product.bDescription}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
            <div className="flex gap-2">
              {product.twitterURL && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#1da1f2] hover:text-[#1da1f2]/80 hover:bg-[#1da1f2]/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={product.twitterURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClick}
              className="h-8 cursor-pointer gap-1 text-xs font-medium text-primary hover:text-primary"
            >
              View
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            {product.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  className="text-xs bg-red-500/70 hover:bg-red-600/70 text-red-700"
                  onClick={() => onDecline(product.name)}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="bg-green-500/70 hover:bg-green-600/70 text-green-700 text-xs"
                  onClick={() => onApprove(product.name)}
                >
                  Approve
                </Button>
              </>
            )}
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-semibold pr-1">By:</span>
            {product.walletAddress?.slice(0, 6)}...
            {product.walletAddress?.slice(-4)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProjectCardGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const baseUrl = import.meta.env.VITE_ENDPOINT_URL;


  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Token used:", localStorage.getItem("token"));
      console.log("Fetched products:", response.data);
      if (response.data.status) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    productName: string,
    status: "PENDING" | "DECLINED" | "PUBLISHED"
  ) => {
    try {
      await axios.put(
        `${baseUrl}/api/products/${productName}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error(`Failed to update status to ${status}`, err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          Loading projects...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProjectCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/${product.uuid}`)}
              onApprove={() => updateStatus(product.name, "PUBLISHED")}
              onDecline={() => updateStatus(product.name, "DECLINED")}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCardGrid;
