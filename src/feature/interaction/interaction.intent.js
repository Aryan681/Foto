import { db } from "../../services/instantDb";

export async function emitInteraction(event) {
  await db.transact(
    db.tx.interactions[event.id].update(event)
  );
}
