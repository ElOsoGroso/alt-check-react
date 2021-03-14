import React, { Component } from 'react'

export default class Table extends Component {
  render() {
    const {
      className = '',
      rowCount = false,
      rows = [],
      template = [],
      totalRows = null,
      clickCell,
      title
    } = this.props

    return (
      <div className={'div-table ' + className}>
        <h3 className="table-title">{title}</h3>
      <React.Fragment>
        <span role="status" className="row-count">
          <span className="row-count-text">
            {rowCount && rows.length > 0 ? `Results: ${totalRows || rows.length}` : ''}
          </span>
        </span>
        <table className="table">
          {template && rows.length > 0 ? (
            <thead
              className={'div-table-heading'}
            >
              <tr>
                {template.map((t, i) => (
                  <th
                    className={`div-table-head`}
                    key={i}
                    tabIndex={undefined}
                  >
                    <div className="flex-row">
                      <span className="header-label">{t.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody className="div-table-body">
            {rows.map((row, i) => {
              return (
                <Row
                  cells={row}
                  template={template}
                  onCellClick={clickCell}
                  alert={row.ALERT_YN}
                  rowIndex={i + 1}
                  key={row.ID + i.toString()}
                />
              )
            })}
          </tbody>
        </table>
      </React.Fragment>
      </div>
    )
  }
}

class Row extends React.Component {
  render() {
    const {
      label,
      template,
      cells,
      onCellClick
    } = this.props
    return (
      <tr
        className={`div-table-row`}
        aria-label={label}
        onKeyPress={this.checkForClick}
      >
        {template.map((t, i) => {
          const cellContent = (
            <React.Fragment>
              { (t.id == "MESSAGE" || t.id == "NAME" || t.id == "FLAGGED_RSN" || t.id == "FLAGGED_USER") && cells[t.id] != "NO RSN INCLUDED" ?   (
                <span className="cell-click" onClick={() => onCellClick(cells[t.id],t.id)}>{cells[t.id]}</span>
              ) : <span className="cell">{cells[t.id]}</span>}
            </React.Fragment>
          )
          return (
            <td
              className={`div-table-cell`}
              key={i}
            >
              {cells.ALERT && i === 0 && (
                <div className="badge row-alert" key={i}>
                  !
                </div>
              )}
              {cellContent}
            </td>
          )
        })}
      </tr>
    )
  }
}

