"""add provider approval status

Revision ID: 20260630_0001
Revises:
Create Date: 2026-06-30
"""

from alembic import op


revision = "20260630_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        "ALTER TABLE provider_profiles "
        "ADD COLUMN IF NOT EXISTS approval_status VARCHAR(30) NOT NULL DEFAULT 'pending'"
    )


def downgrade():
    op.execute(
        "ALTER TABLE provider_profiles "
        "DROP COLUMN IF EXISTS approval_status"
    )
