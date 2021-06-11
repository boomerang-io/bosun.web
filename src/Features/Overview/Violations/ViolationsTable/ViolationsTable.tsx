import React, { Component } from "react";
import moment from "moment";
import {
  Button,
  CodeSnippet,
  ComposedModal,
  DataTable,
  ModalFooter,
  ModalForm,
  ModalBody,
  Tag,
} from "@boomerang-io/carbon-addons-boomerang-react";
import copy from "copy-to-clipboard";
import { isAccessibleEvent } from "@boomerang-io/utils";
import { Violation } from "Types";
import styles from "./violationsTable.module.scss";

type Props = {
  violations: Violation[];
};

type State = any;

export class ViolationsTable extends Component<Props, State> {
  annotationsRef = React.createRef();

  state: { isModalOpen: boolean; selectedPolicyIndex: number | null } = {
    isModalOpen: false,
    selectedPolicyIndex: null,
  };
  headers = [
    {
      header: "Policy",
      key: "policyName",
    },
    {
      header: "Violations",
      key: "nbrViolations",
    },
    {
      header: "Failed Definition Types",
      key: "policyDefinitionTypes",
    },
    {
      header: "Reference ID",
      key: "referenceId",
    },
    {
      header: "Activity Date",
      key: "policyActivityCreatedDate",
    },
  ];

  subHeaders = [
    {
      header: "Metrics",
      key: "metric",
    },
    {
      header: "Message",
      key: "message",
    },
  ];

  renderCell = (rowIndex: any, cellIndex: any, value: any) => {
    const column = this.headers[cellIndex];
    switch (column.header) {
      case "Activity Date":
        return <time className={styles.tableTextarea}>{value ? moment(value).format("MMMM DD, YYYY") : "---"}</time>;
      case "Failed Definition Types":
        return <p className={styles.tableTextarea}>{value && value.length ? value.join(", ") : "---"}</p>;
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  renderSubRow = (row: any) => {
    const { violations } = this.props;
    const currentViolation = violations.find((violation) => violation.id === row.id);
    if (currentViolation && currentViolation.violations.length > 0)
      return currentViolation.violations.map((violation: any) => (
        <div className={styles.subRow}>
          {this.subHeaders.map((cell) => (
            <div key={cell.key} className={`${styles.tableCell} ${styles[cell.key]}`}>
              {this.renderDetail(cell.key, violation[cell.key])}
            </div>
          ))}
        </div>
      ));
    else {
      return (
        <div className={styles.subRow}>
          {this.subHeaders.map((cell) => (
            <div key={cell.key} className={`${styles.tableCell} ${styles[cell.key]}`}>
              {this.renderDetail(cell.key, "---")}
            </div>
          ))}
        </div>
      );
    }
  };

  renderDetail = (key: any, value: any) => {
    switch (key) {
      case "metric":
        return <p className={styles.detailMetrics}>{value}</p>;
      case "message":
        return <p className={styles.detailMessage}>{value}</p>;
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  handleRowClick = (row: any) => {
    this.setState({
      isModalOpen: true,
      selectedPolicyIndex: row,
    });
  };

  render() {
    const { violations } = this.props;
    const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
    const selectedViolation = violations[this.state.selectedPolicyIndex ?? -1];
    return (
      <>
        <ComposedModal
          isOpen={this.state.isModalOpen}
          composedModalProps={{ shouldCloseOnOverlayClick: true }}
          onCloseModal={() => this.setState({ isModalOpen: false })}
          modalHeaderProps={{ title: selectedViolation?.policyName }}
        >
          {() => (
            <ModalForm>
              <ModalBody>
                <h2 className={styles.modalSectionTitle}>{`Violations (${
                  selectedViolation?.violations?.length ?? 0
                })`}</h2>
                <ul className={styles.modalLabels}>
                  {(selectedViolation?.violations ?? [])?.map(({ metric, message }: any, index: any) => (
                    <li key={index}>
                      <span>{metric} : </span>
                      <span style={{ fontStyle: "italic" }}>{message}</span>
                    </li>
                  ))}
                </ul>
                <h2 className={styles.modalSectionTitle}>Failed Definition Types</h2>
                <p>
                  {selectedViolation?.policyDefinitionTypes && selectedViolation?.policyDefinitionTypes.length
                    ? selectedViolation?.policyDefinitionTypes.join(", ")
                    : "---"}
                </p>
                <h2 className={styles.modalSectionTitle}>Labels</h2>
                <ul className={styles.modalLabels}>
                  {Object.entries(selectedViolation?.labels ?? {})?.map((entry) => (
                    <li key={entry[0]}>
                      <Tag type="purple">
                        {entry[0]}
                        <span>:</span>
                        {entry[1]}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <h2 className={styles.modalSectionTitle}>Reference Link</h2>
                {selectedViolation?.referenceLink ? (
                  <a href={selectedViolation.referenceLink}>{selectedViolation.referenceLink}</a>
                ) : (
                  <p>No reference link provided</p>
                )}

                <h2 className={styles.modalSectionTitle}>Reference ID</h2>
                <p>{selectedViolation?.referenceId ?? "---"}</p>
                <h2 className={styles.modalSectionTitle}>Created Date</h2>
                <time>
                  {selectedViolation?.policyActivityCreatedDate
                    ? moment(selectedViolation.policyActivityCreatedDate).format("MMMM DD, YYYY")
                    : "---"}
                </time>
                <h2 className={styles.modalSectionTitle}>Annotations</h2>
                {selectedViolation?.annotations ? (
                  <CodeSnippet
                    copyButtonDescription="Copy annotations to clipboard"
                    onClick={() => copy(JSON.stringify([selectedViolation?.annotations]))}
                    type="multi"
                  >
                    {JSON.stringify([selectedViolation?.annotations], null, 1)}
                  </CodeSnippet>
                ) : (
                  "---"
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => this.setState({ isModalOpen: false })} data-testid="close-violation-detail">
                  Close
                </Button>
              </ModalFooter>
            </ModalForm>
          )}
        </ComposedModal>
        <DataTable
          rows={violations}
          headers={this.headers}
          isSortable={true}
          render={({ rows, headers, getHeaderProps, getRowProps }: any) => (
            <TableContainer>
              <Table isSortable className={styles.tableContainer} useZebraStyles={false}>
                <TableHead>
                  <TableRow className={styles.tableHeadRow}>
                    {headers.map((header: any) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header, className: `${styles.tableHeader} ${styles[header.key]}` })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className={styles.tableBody}>
                  {rows.map((row: any, rowIndex: any) => (
                    <TableRow
                      className={styles.tableBodyRow}
                      key={row.id}
                      {...getRowProps({ row })}
                      onClick={() => this.handleRowClick(rowIndex)}
                      onKeyDown={(e: any) => isAccessibleEvent(e) && this.handleRowClick(rowIndex)}
                      tabIndex={0}
                      data-testid="violations-table-row"
                    >
                      {row.cells.map((cell: any, cellIndex: any) => (
                        <TableCell key={cellIndex} style={{ padding: "0" }}>
                          <div className={styles.tableCell}>{this.renderCell(rowIndex, cellIndex, cell.value)}</div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      </>
    );
  }
}

export default ViolationsTable;
