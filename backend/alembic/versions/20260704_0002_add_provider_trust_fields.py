"""add provider trust fields

Revision ID: 20260704_0002
Revises: 20260630_0001
Create Date: 2026-07-04
"""

from alembic import op


revision = "20260704_0002"
down_revision = "20260630_0001"
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS bio VARCHAR(500)")
    op.execute(
        "ALTER TABLE provider_profiles "
        "ADD COLUMN IF NOT EXISTS experience_years INTEGER NOT NULL DEFAULT 0"
    )
    op.execute("ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS service_area VARCHAR(200)")
    op.execute("ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS availability VARCHAR(120)")
    op.execute("ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(30)")
    op.execute(
        "ALTER TABLE provider_profiles "
        "ADD COLUMN IF NOT EXISTS id_verification_status VARCHAR(30) NOT NULL DEFAULT 'not_submitted'"
    )
    op.execute("ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS admin_notes VARCHAR(500)")


def downgrade():
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS admin_notes")
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS id_verification_status")
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS contact_phone")
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS availability")
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS service_area")
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS experience_years")
    op.execute("ALTER TABLE provider_profiles DROP COLUMN IF EXISTS bio")
