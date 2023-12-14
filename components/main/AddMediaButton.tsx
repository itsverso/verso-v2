"use client";
import React, { useState, useEffect } from "react";
import { Plus, Pencil, Image } from "@/resources/icons";

export function AddMediaButton() {
	return (
		<div className="fixed bottom-10 right-10 flex flex-col items-center">
			<div className="my-1 flex items-center justify-center  h-10 w-10 rounded-full bg-teal-400 hover:opacity-90 cursor-pointer shadow-2xl">
				<Image size="6" color="black" />
			</div>

			<div className="my-1 flex items-center justify-center  h-10 w-10 rounded-full bg-teal-400 hover:opacity-90 cursor-pointer shadow-2xl">
				<Pencil size="6" color="black" />
			</div>
			<div className="my-1 flex items-center justify-center  h-14 w-14 rounded-full bg-teal-400 hover:opacity-90 cursor-pointer shadow-2xl">
				<Plus size="6" color="black" />
			</div>
		</div>
	);
}
