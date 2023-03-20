import React, { PureComponent } from 'react'
import './footer.css';

export default class footer extends PureComponent {
  render() {
    return (
        <>
        <div className="footer">
          <footer className="bg-dark text-light py-3">
            <p className="text-center">
            Copyright &copy; 2023
            </p>
          </footer>
        </div>
        </>
    )
  }
}
