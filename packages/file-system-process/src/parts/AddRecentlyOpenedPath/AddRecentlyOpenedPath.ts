import { addToArrayUnique } from '../AddToArrayUnique/AddToArrayUnique.ts'
import { getRecentlyOpened } from '../GetRecentlyOpened/GetRecentlyOpened.ts'
import { setRecentlyOpened } from '../SetRecentlyOpened/SetRecentlyOpened.ts'
import { VError } from '../VError/VError.ts'

export const addRecentlyOpenedPath = async (recentlyOpenedUri: string, uri: string): Promise<void> => {
  try {
    const parsed = await getRecentlyOpened(recentlyOpenedUri)
    const newRecentlyOpened = addToArrayUnique(parsed, uri)
    await setRecentlyOpened(recentlyOpenedUri, newRecentlyOpened)
  } catch (error) {
    throw new VError(error, `Failed to add path to recently opened`)
  }
}
