"""add_structured_data_to_prescriptions

Revision ID: 6130bece6316
Revises: 001
Create Date: 2025-11-24 12:51:43.106812

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6130bece6316'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add structured_data JSON column to prescriptions table
    # SQLite doesn't support ALTER COLUMN, so we only add the new column
    op.add_column('prescriptions', sa.Column('structured_data', sa.JSON(), nullable=True))


def downgrade() -> None:
    # Remove structured_data column
    op.drop_column('prescriptions', 'structured_data')
