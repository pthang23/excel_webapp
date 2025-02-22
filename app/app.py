from merge import aggregate_sales

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import logging
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)

app = Flask(__name__)
CORS(app)


@app.route("/upload", methods=["POST"])
def upload_file():
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist("files")
    print(files)

    if not files:
        return jsonify({"error": "No selected file"}), 400

    output_file = aggregate_sales(files[0])

    original_filename = files[0].filename
    new_filename = f"aggregated_{original_filename}"

    return send_file(output_file, as_attachment=True, download_name=new_filename, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
