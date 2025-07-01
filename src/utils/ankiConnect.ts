
interface AnkiConnectRequest {
  action: string;
  version: number;
  params?: any;
}

interface AnkiConnectResponse {
  result: any;
  error: string | null;
}

class AnkiConnect {
  private readonly url = 'http://localhost:8765';
  private readonly version = 6;

  private async invoke(action: string, params?: any): Promise<any> {
    const request: AnkiConnectRequest = {
      action,
      version: this.version,
      params: params || {}
    };

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnkiConnectResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.result;
    } catch (error) {
      console.error('AnkiConnect error:', error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.invoke('version');
      return true;
    } catch {
      return false;
    }
  }

  async getDeckNames(): Promise<string[]> {
    return await this.invoke('deckNames');
  }

  async addNote(deckName: string, front: string, back: string, tags: string[] = []): Promise<number> {
    const note = {
      deckName,
      modelName: 'Basic',
      fields: {
        Front: front,
        Back: back
      },
      tags
    };

    return await this.invoke('addNote', { note });
  }

  async addNotes(deckName: string, notes: Array<{ front: string; back: string; tags?: string[] }>): Promise<number[]> {
    const ankiNotes = notes.map(note => ({
      deckName,
      modelName: 'Basic',
      fields: {
        Front: note.front,
        Back: note.back
      },
      tags: note.tags || []
    }));

    return await this.invoke('addNotes', { notes: ankiNotes });
  }

  async createDeck(deckName: string): Promise<number> {
    return await this.invoke('createDeck', { deck: deckName });
  }
}

export const ankiConnect = new AnkiConnect();
export default ankiConnect;
