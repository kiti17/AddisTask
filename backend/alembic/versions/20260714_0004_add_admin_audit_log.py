"""add admin audit log

Revision ID: 20260714_0004
Revises: 20260711_0003
Create Date: 2026-07-14
"""

from alembic import op


revision = "20260714_0004"
down_revision = "20260711_0003"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS admin_audit_logs (
            id SERIAL PRIMARY KEY,
            admin_id INTEGER,
            action VARCHAR(80) NOT NULL,
            entity_type VARCHAR(80) NOT NULL,
            entity_id INTEGER,
            details TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_admin_audit_logs_admin_id "
        "ON admin_audit_logs (admin_id)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_admin_audit_logs_entity_id "
        "ON admin_audit_logs (entity_id)"
    )


def downgrade():
    op.execute("DROP TABLE IF EXISTS admin_audit_logs")
