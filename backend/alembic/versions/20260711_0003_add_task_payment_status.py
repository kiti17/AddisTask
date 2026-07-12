"""add task payment status

Revision ID: 20260711_0003
Revises: 20260704_0002
Create Date: 2026-07-11
"""

from alembic import op


revision = "20260711_0003"
down_revision = "20260704_0002"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid'"
    )


def downgrade():
    op.execute("ALTER TABLE tasks DROP COLUMN IF EXISTS payment_status")
