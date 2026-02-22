import asyncio
import random


async def simulate_ai_delay(min_ms: int = 500, max_ms: int = 2000):
    """Simulate AI processing time for realistic demo feel."""
    delay = random.randint(min_ms, max_ms) / 1000
    await asyncio.sleep(delay)
