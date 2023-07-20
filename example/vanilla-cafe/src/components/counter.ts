import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { store } from '../store';

@customElement('view-counter')
export class SimpleGreeting extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      color: #fff;
    }
  `;

  // Declare reactive properties
  @state() count: number = 0;
  unsub?: ()=>void;

  handleCountChange(count: number){
    this.count = count
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsub = store.sub.count(this.handleCountChange.bind(this))
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