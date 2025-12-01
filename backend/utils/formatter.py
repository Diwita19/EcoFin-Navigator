def clean_text(t):
    if not t:
        return ""
    return (
        t.replace("\\n", "\n")
         .replace("**", "")
         .strip()
    )