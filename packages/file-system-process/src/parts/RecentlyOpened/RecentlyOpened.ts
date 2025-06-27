import { addToArrayUnique } from '../AddToArrayUnique/AddToArrayUnique.ts'
import { getRecentlyOpened } from '../GetRecentlyOpened/GetRecentlyOpened.ts'
import { setRecentlyOpened } from '../SetRecentlyOpened/SetRecentlyOpened.ts'
import { VError } from '../VError/VError.ts'

export const addPath = async (recentlyOpenedPath: string, path: string): Promise<void> => {
  try {
    const parsed = await getRecentlyOpened(recentlyOpenedPath)
    const newRecentlyOpened = addToArrayUnique(parsed, path)
    await setRecentlyOpened(recentlyOpenedPath, newRecentlyOpened)
  } catch (error) {
    throw new VError(error, `Failed to add path to recently opened`)
  }
}
