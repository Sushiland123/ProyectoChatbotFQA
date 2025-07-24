// session.manager.ts
type SessionState = {
  waitingForContact?: boolean;
};

export class SessionManager {
  private sessions = new Map<string, SessionState>();

  get(sessionId: string): SessionState {
    return this.sessions.get(sessionId) || {};
  }

  set(sessionId: string, state: SessionState) {
    this.sessions.set(sessionId, state);
  }

  clear(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}

export const sessionManager = new SessionManager();
