from src.db.seed import seed_database
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-f",
        "--fresh",
        action="store_true",
        help="seeds only the default categories, no dev data",
    )
    args = parser.parse_args()
    seed_database(dev=not args.default)  # dev=True unless flag given
