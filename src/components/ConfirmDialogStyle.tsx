/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 14:43:06
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 17:49:37
 */

/*
 * Usage:
 *
 * Wrap any element with this component and you'll get a confirmation
 * dialog popup when the element inside is clicked.
 *
 * <ConfirmDialog onConfirm={() => Do something }
 *   onCancel={() => Do something}
 *   content={(props: any) => <div>Are you sure?</div>}
 *   cancelOnClickOutside={true} >
 *   <button>Click Me!</button>
 * </ConfirmDialog>
 *
 */

import * as React from 'react';
const defaultStyles: ConfirmDialogStyle = {

  container: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'default',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
  },

  dialog: {
    backgroundColor: 'rgba(23, 5, 62, 1.0)',
    minWidth: '250px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    borderRadius: '26px',
  },

  content: {
    padding: '28px',
    flex: '1 1 auto',
  },

  buttons: {
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
  },

  confirmButton: {
    padding: '5px 10px',
    cursor: 'pointer',
  },

  cancelButton: {
    padding: '5px 10px',
    cursor: 'pointer',
  }
};

export interface ConfirmDialogStyle {
  container: React.CSSProperties;
  dialog: React.CSSProperties;
  content: React.CSSProperties;
  buttons: React.CSSProperties;
  confirmButton: React.CSSProperties;
  cancelButton: React.CSSProperties;
}

export interface ConfirmDialogProps<ContentProps> {
  onConfirm: () => boolean;
  onCancel: () => void;
  content: (props: ContentProps) => JSX.Element;
  onShow?: () => void;
  cancelOnClickOutside?: boolean;
  contentProps?: ContentProps;
  style?: Partial<ConfirmDialogStyle>;
  confirmButtonContent?: JSX.Element | string;
  cancelButtonContent?: JSX.Element | string;
}

export interface ConfirmDialogState {
  hidden: boolean;
  cancelOnClickOutside: boolean;
}

class ConfirmDialog<ContentProps> extends React.Component<ConfirmDialogProps<ContentProps>, ConfirmDialogState> {

  constructor(props: ConfirmDialogProps<ContentProps>) {
    super(props);

    this.state = {
      hidden: true,
      cancelOnClickOutside: this.props.cancelOnClickOutside || false,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.windowMouseDown);
  }

  show = () => {
    if (this.props.onShow) {
      this.props.onShow();
    }
    this.setState({
      hidden: false
    } as any);
    this.mouseOver = false;
  }

  hide = () => {
    this.setState({
      hidden: true
    } as any);
    window.removeEventListener('mousedown', this.windowMouseDown);
    this.mouseOver = false;
  }

  confirm = () => {
    const hide: boolean = this.props.onConfirm();
    if (hide ) {
      this.hide();
    }
  }

  cancel = () => {
    this.props.onCancel();
    this.hide();
  }

  mouseOver = false;
  onMouseEnter = () => {
    this.mouseOver = true;
  }

  onMouseleave = () => {
    this.mouseOver = false;
  }

  windowMouseDown = () => {
    if (this.state.cancelOnClickOutside && !this.state.hidden && !this.mouseOver) {
      this.cancel();
    }
  }

  clicked = () => {
    if (!this.state.hidden) return;
    this.show();
    window.addEventListener('mousedown', this.windowMouseDown);
  }

  render() {
    const ss = defaultStyles
    return (
      <div onClick={this.clicked} style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <div style={defaultStyles.container}>
              <div style={ss.dialog} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseleave}>
                <div style={ss.content}>
                  {/*<this.props.content {...this.props.contentProps} />*/}
                  {this.props.contentProps || 'Are you sure of what you are doing?'}

                </div>
                <div style={ss.buttons}>
                  <div style={(ss.confirmButton)} onClick={this.confirm}>
                    {this.props.confirmButtonContent || 'Confirm'}
                  </div>
                  <div style={(ss.cancelButton)} onClick={this.cancel}>
                    {this.props.cancelButtonContent || 'Cancel'}
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default ConfirmDialog;
