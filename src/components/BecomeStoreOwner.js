import React from 'react'

const BecomeStoreOwner = () => {
  const productKey = `become-store-owner`

  return (
    <div className="modal fade" id={productKey} tabIndex="-1" role="dialog" aria-labelledby={`${productKey}-label`} aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h3 className="modal-title" id={`${productKey}-label`}>Become A Store Owner</h3>
            <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form className="pure-form pure-form-aligned">
              <fieldset>
                <div className="pure-control-group">
                  Send <a href="https://twitter.com/shionwah/" target="_blank">@shionwah</a> a message with your Rinkeby address!
                </div>
              </fieldset>

            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  )
}


export default BecomeStoreOwner;