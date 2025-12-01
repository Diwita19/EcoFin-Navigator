class MemoryBuffer:
    def __init__(self):
        self.messages = []

    def add(self, role, text):
        self.messages.append({"role": role, "text": text})

    def get_context(self):
        return "\n".join(
            f"{m['role'].upper()}: {m['text']}"
            for m in self.messages[-10:]  # limit history
        )

memory = MemoryBuffer()