import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { formatPostDate } from "../../../utils/date";
import { FaHeart, FaTrash, FaRegHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Notice = ({ notice }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const noticeOwner = notice.user;
  const isMyNotice = authUser?._id === noticeOwner._id;

  const isLiked = notice.likes.includes(authUser?._id);
  const formattedDate = formatPostDate(notice.createdAt);

  const { mutate: likeNotice, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/notices/like/${notice._id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["notices"], (oldData) =>
        oldData.map((n) =>
          n._id === notice._id ? { ...n, likes: updatedLikes } : n
        )
      );
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: deleteNotice, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/notices/${notice._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Notice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  const handleDeleteNotice = () => {
    deleteNotice();
  };

  const handleLikeNotice = () => {
    if (isLiking) return;
    likeNotice();
  };

  console.log("Auth User:", authUser);
  console.log("Notice Owner:", notice.user);

  console.log("Notice Owner ID:", noticeOwner?._id);
  console.log("Is My Notice:", isMyNotice);

  return (
    <div className="bg-secondary rounded-xl shadow-md p-6 mb-2 w-full max-w-md mx-auto hover:shadow-xl transition-shadow duration-200 flex flex-col items-center">
      {/* Notice Header */}
      <div className="flex items-center mb-4 w-full">
        <Link to={`/profile/${noticeOwner.username}`} className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
            src={noticeOwner.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
        <div className="ml-4 flex-1">
          <Link
            to={`/profile/${noticeOwner.username}`}
            className="text-lg font-semibold text-white hover:text-primary transition-colors"
          >
            {noticeOwner.fullName}
          </Link>
          <p className="text-sm text-gray-400">
            @{noticeOwner.username || "username"}
          </p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        {isMyNotice && (
          <button
            className="text-red-500 hover:text-red-600 transition-colors ml-auto mb-7"
            onClick={handleDeleteNotice}
          >
            {!isDeleting ? (
              <FaTrash />
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Notice Image */}
      {notice.image && (
        <img
          className="mb-4 w-full h-auto rounded-lg"
          src={notice.image}
          alt="Notice"
        />
      )}

      {/* Notice Text */}
      <p className="text-white text-sm mb-4 text-center">{notice.text}</p>

      {/* Actions: Like */}
      <div className="border-t border-neutral-600 pt-4 flex justify-around text-gray-400">
        {/* Like Button */}
        <div
          onClick={handleLikeNotice}
          className="flex items-center space-x-1 cursor-pointer"
        >
          {isLiking ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : isLiked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span>{notice.likes.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Notice;
