import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { snap, sub } from '../store';

@customElement('view-counter')
export class ViewCounter extends LitElement {

  static styles = css`
    :host {
      color: #fff;
    }
  `;

  @state() count: number = snap.count();
  unsub?: ()=>void;

  handleCountChange(newCount: number){
    this.count = newCount
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsub = sub.count(this.handleCountChange.bind(this))
  }
  disconnectedCallback() {
    this.unsub?.()
    super.disconnectedCallback();
  }

  // Render the UI as a function of component state
  render() {
    return html`<p>Count: ${this.count}</p>`;
  }
}