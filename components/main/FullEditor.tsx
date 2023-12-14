import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Spinner } from "../common/Spinner";
import * as Icons from "../../resources/icons";

import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";

export function FullEditor() {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
			},
		},
		extensions: [
			Heading.configure({
				HTMLAttributes: {
					levels: [1, 2, 3],
				},
			}),
			Document,
			History,
			Paragraph,
			Blockquote,
			Text,
			Link.configure({
				openOnClick: false,
			}),
			Bold,
			Underline,
			Italic,
			Strike,
			Code,
			Image.configure({
				HTMLAttributes: {
					class: "w-2/3 ml-auto mr-auto",
				},
				allowBase64: true,
				inline: true,
			}),
		],
		content: `<p>Section title</p><p>Section subtitle...</p>`,
	}) as Editor;

	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [url, setUrl] = useState<string>("");

	const toggleHeading = useCallback(
		(level: any) => {
			editor.chain().focus().toggleHeading({ level: level }).run();
		},
		[editor]
	);

	const toggleBold = useCallback(() => {
		editor.chain().focus().toggleBold().run();
	}, [editor]);

	const toggleUnderline = useCallback(() => {
		editor.chain().focus().toggleUnderline().run();
	}, [editor]);

	const toggleItalic = useCallback(() => {
		editor.chain().focus().toggleItalic().run();
	}, [editor]);

	const toggleBlockquote = useCallback(() => {
		editor.chain().focus().toggleBlockquote().run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<>
			<div className="relative w-full h-72 border border-black">
				<BubbleMenu
					pluginKey="bubbleMenuText"
					className="bg-zinc-800 flex items-center min-w-max gap-2 p-2 rounded-md"
					tippyOptions={{ duration: 150 }}
					editor={editor}
					shouldShow={({
						editor,
						view,
						state,
						oldState,
						from,
						to,
					}) => {
						// only show if range is selected.
						return from !== to;
					}}
				>
					<button
						className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc-700"
						onClick={() => toggleHeading(1)}
					>
						<p className="text-white text-sm font-mono">H1</p>
					</button>
					<button
						className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc-700"
						onClick={() => toggleHeading(2)}
					>
						<p className="text-white text-xs font-mono">H2</p>
					</button>
					<button
						className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc-700"
						onClick={() => toggleHeading(3)}
					>
						<p className="text-white text-xs font-mono">H3</p>
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc-700",
							{
								"is-active": editor.isActive("bold"),
							}
						)}
						onClick={toggleBold}
					>
						<Icons.Bold color="white" />
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc-700",
							{
								"is-active": editor.isActive("underline"),
							}
						)}
						onClick={toggleUnderline}
					>
						<Icons.Underline color="white" />
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc-700",
							{
								"is-active": editor.isActive("intalic"),
							}
						)}
						onClick={toggleItalic}
					>
						<Icons.Italic color="white" />
					</button>
					<button
						className={classNames(
							"pointer-cursor flex justify-center items-center h-10 w-10 pt-4 rounded-md hover:bg-zinc-700",
							{
								"is-active": editor.isActive("blockquote"),
							}
						)}
						onClick={toggleBlockquote}
					>
						<p className="text-white text-4xl font-extralight">
							&apos;&apos;
						</p>
					</button>
				</BubbleMenu>

				<div className="">
					<EditorContent editor={editor} />
				</div>
			</div>
		</>
	);
}

/**
 * 
 * <div className="h-16 fixed bottom-0 right-0 flex flex-row items-center justify-center lg:justify-end">
					<button
						onClick={handleMintVerso}
						className="h-16 px-10 bg-zinc800 shadow-lg flex flex-row items-center justify-center hover:opacity-90 cursor-pointer text-sm sm:text-base"
					>
						{loading ? (
							<Spinner color={"white"} size={"5"} />
						) : (
							<p className="text-zinc100">Mint Verso</p>
						)}
					</button>
				</div>
 */
