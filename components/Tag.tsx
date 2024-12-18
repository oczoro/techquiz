"use client";
import { Tag as TagType } from "@/types";
import IonClose from "~icons/ion/close.jsx";

export const Tag = ({
  tag,
  onRemove,
}: {
  tag: TagType;
  onRemove: (tag: TagType) => void;
}) => {
  return (
    <div className="flex rounded-full bg-blue-100/50 px-2 py-1">
      <span className="text-sm text-cyan-700">{tag.name}</span>
      <IonClose
        onClick={() => onRemove(tag)}
        className="ml-2 cursor-pointer text-cyan-800 transition duration-100 ease-out hover:text-cyan-500"
      />
    </div>
  );
};
