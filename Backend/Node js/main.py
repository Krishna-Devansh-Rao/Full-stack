import tkinter as tk
from tkinter import filedialog, messagebox
import yt_dlp
import os

def download_video():
    url = url_entry.get().strip()

    if not url:
        messagebox.showwarning("Missing Link", "Please YouTube link paste karo.")
        return

    # Folder select popup
    save_folder = filedialog.askdirectory(
        title="Video kaha save karna hai?"
    )

    if not save_folder:
        return

    try:
        ydl_opts = {
            "format": "bv*+ba/b",
            "merge_output_format": "mp4",
            "outtmpl": os.path.join(save_folder, "%(title)s.%(ext)s"),
            "noplaylist": True,
        }

        status_label.config(text="Downloading... Please wait.")
        root.update()

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        status_label.config(text="Download Complete!")

        messagebox.showinfo(
            "Success",
            f"Video successfully save ho gaya!\n\n{save_folder}"
        )

    except Exception as e:
        status_label.config(text="Download failed.")
        messagebox.showerror(
            "Error",
            f"Video download nahi ho paya.\n\n{str(e)}"
        )


# ---------------- GUI ----------------

root = tk.Tk()
root.title("YouTube MP4 Downloader")
root.geometry("500x250")
root.resizable(False, False)

title = tk.Label(
    root,
    text="YouTube → MP4 Downloader",
    font=("Arial", 20, "bold")
)
title.pack(pady=25)

url_entry = tk.Entry(
    root,
    width=55,
    font=("Arial", 12)
)
url_entry.pack(pady=10)

url_entry.insert(0, "Paste YouTube link here")

download_btn = tk.Button(
    root,
    text="Download MP4",
    font=("Arial", 13, "bold"),
    command=download_video,
    padx=20,
    pady=8
)
download_btn.pack(pady=15)

status_label = tk.Label(
    root,
    text="Ready",
    font=("Arial", 11)
)
status_label.pack()

root.mainloop()