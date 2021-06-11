import React from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Button, DataTable } from "@boomerang-io/carbon-addons-boomerang-react";
import { Add16 } from "@carbon/icons-react";
import { appLink } from "Config/appConfig";
import { PolicyDefinitionTemplate } from "Types";
import styles from "./templatesTable.module.scss";

const headers = [
  {
    header: "Name",
    key: "name",
  },

  {
    header: "Description",
    key: "description",
  },
  {
    header: "Created Date",
    key: "createdDate",
  },
  {
    header: "Key",
    key: "key",
  },
];

type Props = {
  data: PolicyDefinitionTemplate[];
};

export default function TemplatesTable(props: Props) {
  let history = useHistory();
  const handleRowClick = (row: any) => {
    history.push(appLink.editTemplate({ templateId: row.id }));
  };

  const handleCreateButtonClick = (row: any) => {
    history.push(appLink.createTemplate());
  };

  const renderCell = (cells: any, cellIndex: number, value: any) => {
    const column = headers[cellIndex];
    switch (column.header) {
      case "Name":
        return <p className={styles.tableTextarea}>{value}</p>;
      case "Description":
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
      case "Key":
        return <p className={styles.tableTextarea}>{value}</p>;
      case "Created Date":
        return <time className={styles.tableTextarea}>{value ? moment(value).format("MMMM DD, YYYY") : "---"}</time>;
      default:
        return value || "---";
    }
  };

  const { data } = props;
  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  return (
    <div className={styles.container}>
      <Button
        className={styles.createButton}
        iconDescription="Create Template"
        onClick={handleCreateButtonClick}
        renderIcon={Add16}
        size="field"
      >
        Create Template
      </Button>
      <DataTable
        rows={data}
        headers={headers}
        isSortable={true}
        render={({ rows, headers, getHeaderProps }: any) => (
          <TableContainer>
            <Table isSortable className={styles.tableContainer} useZebraStyles={false}>
              <TableHead>
                <TableRow className={styles.tableHeadRow}>
                  {headers.map((header: { key: string; header: string }) => (
                    <TableHeader
                      {...getHeaderProps({ header, className: `${styles.tableHeader} ${styles[header.key]}` })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={styles.tableBody} data-testid="templates-tbody">
                {rows.map((row: any, rowIndex: number) => (
                  <TableRow
                    key={row.id}
                    className={styles.tableRow}
                    onClick={() => handleRowClick(row)}
                    data-testid="templates-table-row"
                  >
                    {row.cells.map((cell: any, cellIndex: number) => (
                      <TableCell key={`${cell.id}-${cellIndex}`} style={{ padding: "0" }}>
                        <div className={styles.tableCell}>{renderCell(row.cells, cellIndex, cell.value)}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
    </div>
  );
}
