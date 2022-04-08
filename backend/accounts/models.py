import string
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import UserManager as BaseUserManager, PermissionsMixin
import qsessions.models


class Session(qsessions.models.Session):
    class Meta(qsessions.models.Session.Meta):
        app_label = 'accounts'
        proxy = True


class UserManager(BaseUserManager):
    def _create_user(self, email, password, role, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, role=Roles.CLIENT, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, role=Roles.ADMIN, **extra_fields)


class Roles(models.TextChoices):
    ADMIN = 'ADMIN', _('admin')
    REALTOR = 'REALTOR', _('realtor')
    CLIENT = 'CLIENT', _('client')


class User(AbstractBaseUser, PermissionsMixin):
    user_permissions = None
    groups = None

    first_name = models.CharField(_('first name'), max_length=30)
    last_name = models.CharField(_('last name'), max_length=30)
    email = models.EmailField(_('email address'), unique=True, db_index=True)

    role = models.CharField(choices=Roles.choices, default=Roles.CLIENT, max_length=8, db_index=True)

    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        ordering = ['-id']
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        return string.capwords(('%s %s' % (self.first_name, self.last_name)).strip().lower())
