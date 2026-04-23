import type { Message } from "../types"

// ─── Branch Store ─────────────────────────────────────────────────────────────
// A simplified branching tree inspired by assistant-ui's MessageRepository.
// Each message can have multiple children (branches). When a user edits
// a message, the new response becomes a sibling branch.

interface BranchNode {
  message: Message
  children: string[]     // message IDs of child branches
  selectedIndex: number // which child branch is currently active
  parentId: string | null
}

export class BranchStore {
  private nodes = new Map<string, BranchNode>()
  private rootIds: string[] = []
  private _headId: string | null = null

  get messages(): Message[] {
    const result: Message[] = []
    let currentIds = [...this.rootIds]

    while (currentIds.length > 0) {
      const id = currentIds[0]
      const node = this.nodes.get(id)
      if (!node) break

      result.push({
        ...node.message,
        branchNumber: this.getBranchNumber(id),
        branchCount: node.children.length > 0 ? node.children.length : 1,
      })

      if (node.children.length > 0) {
        currentIds = [node.children[node.selectedIndex]]
      } else {
        break
      }
    }

    return result
  }

  get headId(): string | null {
    return this._headId
  }

  addMessage(message: Message, parentId?: string): void {
    const node: BranchNode = {
      message,
      children: [],
      selectedIndex: 0,
      parentId: parentId ?? null,
    }
    this.nodes.set(message.id, node)

    if (parentId) {
      const parent = this.nodes.get(parentId)
      if (parent) {
        parent.children.push(message.id)
        parent.selectedIndex = parent.children.length - 1
      }
    } else {
      this.rootIds.push(message.id)
    }

    this._headId = message.id
  }

  updateMessage(id: string, updates: Partial<Message>): void {
    const node = this.nodes.get(id)
    if (node) {
      node.message = { ...node.message, ...updates }
    }
  }

  removeMessage(id: string): void {
    const node = this.nodes.get(id)
    if (!node) return

    // Remove from parent's children
    if (node.parentId) {
      const parent = this.nodes.get(node.parentId)
      if (parent) {
        const idx = parent.children.indexOf(id)
        if (idx !== -1) {
          parent.children.splice(idx, 1)
          if (parent.selectedIndex >= parent.children.length) {
            parent.selectedIndex = Math.max(0, parent.children.length - 1)
          }
        }
      }
    } else {
      this.rootIds = this.rootIds.filter((rid) => rid !== id)
    }

    // Recursively remove children
    const removeChildren = (nodeId: string) => {
      const n = this.nodes.get(nodeId)
      if (n) {
        for (const childId of n.children) {
          removeChildren(childId)
        }
        this.nodes.delete(nodeId)
      }
    }
    removeChildren(id)

    // Update head
    if (this._headId === id) {
      this._headId = this.findNewHead()
    }
  }

  switchBranch(messageId: string, branchIndex: number): void {
    const node = this.nodes.get(messageId)
    if (!node) return

    // Find the parent that contains this message as a child
    if (node.parentId) {
      const parent = this.nodes.get(node.parentId)
      if (parent && branchIndex < parent.children.length) {
        parent.selectedIndex = branchIndex
      }
    }

    this._headId = this.findLeaf(node.parentId ? this.nodes.get(node.parentId)!.children[branchIndex] : messageId)
  }

  getBranchInfo(messageId: string): { current: number; total: number } {
    const node = this.nodes.get(messageId)
    if (!node || !node.parentId) return { current: 0, total: 1 }

    const parent = this.nodes.get(node.parentId)
    if (!parent) return { current: 0, total: 1 }

    return {
      current: parent.children.indexOf(messageId),
      total: parent.children.length,
    }
  }

  private getBranchNumber(messageId: string): number {
    const node = this.nodes.get(messageId)
    if (!node || !node.parentId) return 0
    const parent = this.nodes.get(node.parentId)
    if (!parent) return 0
    return parent.children.indexOf(messageId) + 1
  }

  private findLeaf(id: string): string {
    const node = this.nodes.get(id)
    if (!node || node.children.length === 0) return id
    return this.findLeaf(node.children[node.selectedIndex])
  }

  private findNewHead(): string | null {
    if (this.rootIds.length === 0) return null
    const lastRoot = this.rootIds[this.rootIds.length - 1]
    return this.findLeaf(lastRoot)
  }
}