import io
import pandas as pd


def aggregate_sales(file):
    xls = pd.ExcelFile(file)

    all_sheet = []
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        try:
            header_row = df[df.iloc[:, 0] == '品目コード'].index[0]
            df = df.iloc[header_row:].reset_index(drop=True)
            df.columns = df.iloc[0]
            df = df[1:].reset_index(drop=True)
        except IndexError:
            pass

        date_columns = df.columns[2:]
        df = df.melt(id_vars=[df.columns[0], df.columns[1]],
                     value_vars=date_columns,
                     var_name='day',
                     value_name='sales')

        df['day'] = pd.to_datetime(df['day'], errors='coerce', dayfirst=True)
        df = df.dropna(subset='day')

        all_sheet.append(df)

    combined_df = pd.concat(all_sheet, ignore_index=True)

    aggregated_df = combined_df.groupby(['品目コード', '品目名', 'day'])['sales'].sum().reset_index()
    aggregated_df = aggregated_df.pivot_table(index=['品目コード', '品目名'],
                                              columns='day',
                                              values='sales',
                                              fill_value=None).reset_index()
    aggregated_df.replace(0, pd.NA, inplace=True)

    date_columns_sorted = sorted(aggregated_df.columns[2:], key=pd.to_datetime)
    aggregated_df.columns = ['品目コード', '品目名'] + [col.strftime('%m/%d/%Y') for col in date_columns_sorted]

    aggregated_df['Total'] = aggregated_df.iloc[:, 2:].sum(axis=1, skipna=True)

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        aggregated_df.to_excel(writer, index=False)
    output.seek(0)
    return output